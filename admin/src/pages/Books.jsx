import React, { useEffect, useRef, useState } from "react";
import useAxios from "axios-hooks";
import { useNavigate } from "react-router-dom";
import { url } from "../utils/createData";
import { Card, Row, Col, Button } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState({
    results: [],
    totalCount: null,
  });
  const [reload, setReload] = useState(false);
  const itemsPerPage = 8;
  const searchRef = useRef();
  const navigate = useNavigate();
  // const [{ data: allBooks }, refect] = useAxios({
  //   url: `${url}admin/books`,
  //   params: {
  //     currentPage: currentPage,
  //     itemsPerPage: itemsPerPage,
  //   },
  // });
  // useEffect(() => {
  //   setBooks(allBooks);
  // }, [allBooks]);
  // useEffect(() => {
  //   if (reload) {
  //     refect();
  //     setReload(false);
  //   }
  // }, [reload]);
  const [{}, executePost] = useAxios({
    url: `${url}admin/searchBook`,
  });
  const [{ loading }, executeDelete] = useAxios(
    {
      url: `${url}admin/deleteBook/:id`,
      method: "DELETE",
    },
    { manual: true }
  );

  useEffect(() => {
    (async () => {
      const res = await axios(
        `${url}admin/books?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`
      );
      setBooks(res.data);
    })();
  }, [reload, currentPage]);

  const bookSearchHandle = async (e) => {
    e.preventDefault();
    try {
      const keyword = searchRef.current.value;
      const { data } = await executePost({
        params: { keyword, currentPage, itemsPerPage },
      });
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBooks = async (id) => {
    try {
      await executeDelete({ url: `${url}admin/deleteBook/${id}` });
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>All Book</title>
      </Helmet>
      <input
        type="search"
        className="form-control mb-5 w-50"
        ref={searchRef}
        placeholder="Enter keyword"
        onChange={bookSearchHandle}
      />

      <Row xs={2} lg={4}>
        {books?.results.(book) => (
          <Col key={book._id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={`${book.imageUrl}`} />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Button
                  type="sumbit"
                  variant="outline-success"
                  className="me-2"
                  onClick={() => navigate(`/editBook/${book._id}`)}
                >
                  Update
                </Button>
                <Button
                  type="submit"
                  variant="outline-danger"
                  onClick={() => deleteBooks(book._id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        count={Math.ceil(books?.totalCount / itemsPerPage) || 0}
        color="primary"
        page={currentPage}
        onChange={(event, page) => setCurrentPage(page)}
      />
    </>
  );
};

export default Books;
