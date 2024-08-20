import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import useAxios from "axios-hooks";
import { useForm } from "react-hook-form";
import { url } from "../utils/CreateData";
import createData from "../utils/CreateData";
import Input from "../utils/Input";
import { checkoutData } from "../context/seachContext";
import { Button, ListGroup, Image, Row, Col, Stack } from "react-bootstrap";
import Cookies from "js-cookie";
const Checkout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ criteriaMode: "all" });

  const { books } = useContext(checkoutData);
  const token = Cookies.get("login");
  const [{ loading }, executePost] = useAxios(
    {
      url: `${url}order`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
    { manual: true }
  );

  const onSubmit = async (data) => {
    try {
      data.totalPrice = books.totalPrice;
      data.books = books.books;
      await executePost({ data });
    } catch (error) {
      console.log(error);
    }
  };
  const inputCheckout = [
    createData(
      "Fullname",
      "text",
      "fullname",
      "Your Fullname",
      register("fullname", {
        required: "required",
      }),
      errors
    ),
    createData(
      "Email",
      "email",
      "email",
      "Your email",
      register("email", {
        required: "required",
        pattern: {
          value: /^[A-Za-z0-9._%+-]+@gmail\.com$/,
          message: "Email invalid",
        },
      }),
      errors
    ),
    createData(
      "Phone",
      "tel",
      "phone",
      "Your phone",
      register("phone", {
        required: "required",
        pattern: {
          value: /^[0-9\b]+$/,
          message: "số điện thoại không hợp lệ",
        },
      }),
      errors
    ),
    createData(
      "Address",
      "text",
      "address",
      "Your address",
      register("address", { required: "required" }),
      errors
    ),
  ];
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div>
      <Helmet>
        <title>Checkout</title>
      </Helmet>
      <div className=" bg-white rounded-2  p-3">
        <h2>Địa chỉ giao hàng</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-50 ">
          <Input inputArr={inputCheckout} />
          <div className="fixed-bottom bg-white p-3 text-center">
            <span>
              <span className="fw-medium ">Tổng số tiền:</span>
              {books.totalPrice.toLocaleString("vi-VN")}VND
            </span>
            <Button
              variant="danger"
              type="submit "
              className="ms-3"
              style={{ width: "250px" }}
              disabled={loading}
            >
              Đặt hàng
            </Button>
          </div>
        </form>
      </div>
      <div></div>
      <div
        className=" bg-white rounded-2 mt-5  p-3"
        style={{ marginBottom: "100px" }}
      >
        <h2>Kiểm tra lại đơn hàng</h2>
        <ListGroup variant="flush">
          {books.books.map((book) => (
            <ListGroup.Item key={book._id._id}>
              <Row>
                <Col>
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="align-items-start"
                  >
                    <Image src={book._id.imageUrl} width={100} height={100} />
                    <p className="text-break ms-2">
                      {truncateText(book._id.title, 100)}
                    </p>
                  </Stack>
                </Col>
                <Col>
                  <Row>
                    <Col>{book._id.price.toLocaleString("vi-VN")}VND</Col>
                    <Col>{book.quantity}</Col>
                    <Col className="text-warning ">
                      {(book._id.price * book.quantity).toLocaleString("vi-VN")}
                      VND
                    </Col>
                  </Row>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Checkout;
