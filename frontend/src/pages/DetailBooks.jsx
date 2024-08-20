import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import { url } from "../utils/CreateData";
import { Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./DetailBook.module.css";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
const DetailBooks = () => {
  const [number, setNumber] = useState(1);

  const { id } = useParams();
  const getToken = Cookies.get("login");
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);

  const [{ data: book = {} }, executeBook] = useAxios();

  // const [isFirstRender, setIsFirstRender] = useState(true);

  // useEffect(() => {
  //   if (isFirstRender) {
  //     setIsFirstRender(false);

  //     return; // Không gọi API trong lần render đầu tiên
  //   }

  //   (async () => {
  //     try {
  //       await executeBook(`${url}detailBook/${id}`);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })();
  // }, [executeBook, id, reload, isFirstRender]);
  useEffect(() => {
    (async () => {
      try {
        await executeBook(`${url}detailBook/${id}`);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [executeBook, id, reload]);

  // eslint-disable-next-line no-empty-pattern
  const [{}, executePost] = useAxios({
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });

  const handleChange = (event) => {
    const value = event.target.value;
    // Kiểm tra xem giá trị mới nhập vào có phải là số không
    if (!isNaN(value)) {
      setNumber(value);
    }
  };

  const addBookCart = async (muangay) => {
    if (!getToken) {
      navigate("/login");
      return;
    }
    if (book.count < number) {
      toast.error("không đủ sản phẩm");
      return;
    }
    try {
      await executePost({
        url: `${url}addBookCart`,
        params: { quantity: number, productId: id },
      });
      if (muangay === "mua ngay") {
        navigate("/cart");
      }
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  const description = book.description
    ?.split("\n")
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);
  return (
    <div>
      <Row xs={1} lg={2}>
        <Col className="position-relative z-2">
          {book.count === 0 && (
            <div
              className={`${classes.het} position-absolute z-2 bottom-50 end-50`}
            >
              Hết hàng
            </div>
          )}
          <Image src={book.imageUrl} className="w-100" />
        </Col>
        <Col>
          <h2>{book.title}</h2>
          <p>Giá tiền: {book.price?.toLocaleString("vi-VN")}VND</p>
          <p>Tác giả: {book.author}</p>
          <p>Genre: {book.genre}</p>

          <div className="mb-2">
            <span className="me-2"> Số lượng:</span>
            <button
              className=" border bg-body-tertiary text-secondary"
              onClick={() => setNumber(number - 1)}
              disabled={number === 1 || book.count === 0}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              type="text"
              value={number}
              className={classes.number}
              onChange={handleChange}
              onKeyDown={(e) => {
                // Chỉ cho phép nhập số và các phím điều hướng
                if (
                  !(
                    (e.keyCode >= 48 && e.keyCode <= 57) ||
                    (e.keyCode >= 96 && e.keyCode <= 105) ||
                    e.keyCode === 8 ||
                    e.keyCode === 37 ||
                    e.keyCode === 39
                  )
                ) {
                  e.preventDefault();
                }
              }}
              disabled={book.count === 0}
            />

            <button
              className=" border bg-body-tertiary text-secondary"
              onClick={() => setNumber(number + 1)}
              disabled={book.count === 0}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className="my-3 ">
            <button
              onClick={addBookCart}
              disabled={book.count === 0}
              className="btn btn-outline-danger"
            >
              <FontAwesomeIcon icon={faCartShopping} />
              Thêm vào giỏ hàng
            </button>
            <button
              className="btn btn-danger ms-3"
              disabled={book.count === 0}
              onClick={() => addBookCart("mua ngay")}
            >
              Mua ngay
            </button>
          </div>
          <p>Số lượng sản phẩm trong kho: {book.count}</p>
        </Col>
      </Row>
      <h4 className="mt-5">Chi tiết sản phẩm</h4>
      {description}
    </div>
  );
};

export default DetailBooks;
