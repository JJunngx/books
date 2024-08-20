import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import useAxios from "axios-hooks";
import { url } from "../utils/CreateData";
import { Row, Col, Card } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const [{ data }] = useAxios({
    url: `${url}books`,
    params: {
      currentPage,
      itemsPerPage,
    },
  });

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h2>All Book</h2>
      <Row xs={2} lg={4}>
        {data?.results.map((book) => (
          <Col
            key={book._id}
            className="mb-4"
            onClick={() => navigate(`detailBook/${book._id}`)}
            style={{ cursor: "pointer" }}
          >
            <Card>
              <Card.Img variant="top" src={`${book.imageUrl}`} />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text style={{ color: "#fab005" }}>
                  {book.price.toLocaleString("vi-VN")}VND
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        count={Math.ceil(data?.totalCount / itemsPerPage) || 0}
        color="primary"
        page={currentPage}
        onChange={(event, page) => setCurrentPage(page)}
      />
    </>
  );
};

export default Home;
