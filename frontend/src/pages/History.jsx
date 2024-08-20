import React, { useEffect, useRef, useState } from "react";
import useAxios from "axios-hooks";
import { Helmet } from "react-helmet-async";
import { url } from "../utils/CreateData";
import Cookies from "js-cookie";
import Pagination from "@mui/material/Pagination";
import {
  Button,
  ListGroup,
  Image,
  Row,
  Col,
  ListGroupItem,
  Stack,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import classes from "./History.module.css";

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = Cookies.get("login");
  const [{ data }] = useAxios({
    url: `${url}history`,
    headers: { Authorization: `Bearer ${token}` },
    params: { currentPage, itemsPerPage },
  });
  const [{ data: detailOrder = {} }, executeDetailOrder] = useAxios();
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [detailOrder]);

  const viewDetailOrder = async (id) => {
    await executeDetailOrder(`${url}detailOrder/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>History</title>
      </Helmet>
      <div className="bg-white p-4 rounded-3">
        <h2>Lịch sử đặt hàng</h2>
        <div style={{ minHeight: "500px" }} className=" my-4">
          <table className={`${classes.table}`}>
            <thead>
              <tr className="text-center  border-bottom">
                <th>ID ORDER</th>
                <th>ID USER</th>
                <th>NAME</th>
                <th>PHONE</th>
                <th>ADDRESS</th>
                <th>TOTAL</th>
                <th>DELIVERY</th>
                <th>STATUS</th>
                <th>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {data?.results.map((history) => (
                <tr key={history._id} className="text-secondary border-bottom">
                  <td>{history._id}</td>
                  <td>{history.userId}</td>
                  <td>{history.fullname}</td>
                  <td>{history.phone}</td>
                  <td>{history.address}</td>
                  <td>{history.totalPrice.toLocaleString("vi-VN")} VND</td>
                  <td>{history.delivery}</td>
                  <td>{history.status}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      onClick={() => viewDetailOrder(history._id)}
                    >
                      view <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center">
          <Pagination
            count={Math.ceil(data?.totalCount / itemsPerPage) || 0}
            color="primary"
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {Object.keys(detailOrder).length > 0 && (
        <div className="bg-white my-5  p-4 rounded-3">
          <div ref={scrollRef}>
            <h2>INFORMATION ORDER</h2>
            <p>ID User: {detailOrder.userId}</p>
            <p>Full name: {detailOrder.fullname}</p>
            <p>Address: {detailOrder.address}</p>
            <p>Total: {detailOrder.totalPrice.toLocaleString("vi-VN")}VND</p>
          </div>
          <table className={`${classes.table}`}>
            <thead className="text-center border-bottom">
              <tr>
                <th>ID PRODUCT</th>
                <th>IMAGE</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>COUNT</th>
              </tr>
            </thead>
            <tbody>
              {detailOrder?.books.map((product) => (
                <tr key={product._id._id} className="text-center border-bottom">
                  <td className="fw-medium">{product._id._id}</td>
                  <td>
                    <Image
                      src={product._id.imageUrl}
                      alt={product._id.title}
                      width={140}
                      height={140}
                    />
                  </td>
                  <td className="fw-medium">{product._id.title}</td>
                  <td className="fw-medium">
                    {product._id.price.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="fw-medium">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default History;
