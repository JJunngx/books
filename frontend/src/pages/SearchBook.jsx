import React, { useState, useContext, useEffect } from "react";
import useAxios from "axios-hooks";
import { searchContext } from "../context/seachContext";
import { Row, Col, Card } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import { url } from "../utils/CreateData";
import { useNavigate } from "react-router-dom";

const SearchBook = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [books, setBooks] = useState({ results: [], totalCount: 0 });
  const { keyword } = useContext(searchContext);
  // eslint-disable-next-line no-empty-pattern
  const [{}, executePost] = useAxios({
    url: `${url}searchBook`,
  });
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await executePost({
          params: {
            keyword,
            currentPage,
            itemsPerPage,
          },
        });
        setBooks(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentPage, executePost, keyword]);

  return (
    <div>
      {books.totalCount === 0 ? (
        <p>không tìm thấy kết quả</p>
      ) : (
        <>
          <Row xs={2} lg={4}>
            {books?.results.map((book) => (
              <Col
                key={book._id}
                className="mb-4"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/detailBook/${book._id}`)}
              >
                <Card>
                  <Card.Img variant="top" src={`${book.imageUrl}`} />
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text style={{ color: "#fab005" }}>
                      {book.price}VND
                    </Card.Text>
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
      )}
    </div>
  );
};

export default SearchBook;
