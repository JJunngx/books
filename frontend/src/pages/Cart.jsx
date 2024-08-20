/* eslint-disable no-empty-pattern */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import classes from "./Cart.module.css";
import useAxios from "axios-hooks";
import { FormControlLabel, Checkbox } from "@mui/material";
import Cookies from "js-cookie";
import { url } from "../utils/CreateData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { checkoutData } from "../context/seachContext";
const Cart = () => {
  // const quantityRefs = useRef([]);

  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const getToken = Cookies.get("login");
  const [{}, executePost] = useAxios({
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });

  const [{}, executeDelete] = useAxios({
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });
  const [{}, executeAdjustQuantity] = useAxios({
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });
  const [{}, executeInput] = useAxios({
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });
  const [cart, setCart] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await executePost(`${url}getCart`);
        setCart(data.map((item) => ({ ...item, checked: false })));
      } catch (error) {
        console.log(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);
  const { setBooks } = useContext(checkoutData);

  const adjustProductQuantity = async (id, number, quantity) => {
    if (number === -1 && quantity === 1) {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
      console.log("object");
      await executeDelete({
        url: `${url}deleteItemCart/${id}`,
        params: { quantity },
      });
      setReload(!reload);
    } else if (quantity > 0) {
      await executeAdjustQuantity({
        url: `${url}addBookCart`,
        params: { quantity: number, productId: id },
      });
      setReload(!reload);
    } else {
      toast.info("hết hàng", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    setReload(!reload);
  };

  const deleteItemCart = async (id, quantity) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await executeDelete({
        url: `${url}deleteItemCart/${id}`,
        params: { quantity },
      });
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (event, id, numberOld, count) => {
    const value = +event.target.value;
    if (0 < value < count) {
      try {
        await executeInput({
          url: `${url}addBookCartInput`,
          params: {
            productId: id,
            numberOld: numberOld ?? 1,
            quantity: value,
          },
        });
        setReload(!reload);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const handleChange = async (id, numberOld, count) => {
  //   const value = +quantityRefs.current[id].value;
  //   console.log(value);
  //   if (0 < value < count) {
  //     setTimeout(async () => {
  //       try {
  //         await executeInput({
  //           url: `${url}addBookCartInput`,
  //           params: {
  //             productId: id,
  //             numberOld: numberOld ?? 1,
  //             quantity: value,
  //           },
  //         });
  //         setReload(!reload);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }, 500);
  //   }
  // };
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const handleSelectAllChange = () => {
    const updatedCart = cart.map((item) => ({
      ...item,
      checked: !selectAllChecked,
    }));
    setSelectAllChecked(!selectAllChecked);
    setCart(updatedCart);
  };

  const handleCheckboxChange = (id) => {
    const updatedCheckboxes = cart.map((checkbox) =>
      checkbox._id._id === id
        ? { ...checkbox, checked: !checkbox.checked }
        : checkbox
    );
    setCart(updatedCheckboxes);
    const allChecked = updatedCheckboxes.every((checkbox) => checkbox.checked);
    setSelectAllChecked(allChecked);
  };
  const productSelected = useMemo(
    () => cart.filter((item) => item.checked),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      productSelected.reduce(
        (accumulator, currentProduct) =>
          accumulator + currentProduct._id.price * currentProduct.quantity,
        0
      ),
    [productSelected]
  );
  const navigateCheckout = () => {
    setBooks({
      books: productSelected,
      totalPrice,
    });
    navigate("/checkout");
  };

  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>

      {cart.length !== 0 ? (
        <Row>
          <Col lg={8}>
            <div className="d-flex justify-content-between bg-white rounded-3 p-2 text-center">
              <div className="flex-fill text-start">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                  }
                  label="Chọn tất cả"
                  style={{ height: "24px" }}
                />
              </div>
              <div style={{ flexBasis: "120px" }}>Số lượng</div>
              <div style={{ flexBasis: "120px" }}>Thành tiền</div>
              <div style={{ flexBasis: "120px" }}>Xóa</div>
            </div>

            {cart.map((book) => (
              <div
                key={book._id._id}
                className="d-flex justify-content-between bg-white rounded-3 p-2 text-center mt-3"
              >
                <div className="flex-fill text-start d-flex">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={book.checked}
                        onChange={() => handleCheckboxChange(book._id._id)}
                      />
                    }
                    style={{ height: "24px" }}
                  />

                  <div
                    className="d-flex gap-3"
                    onClick={() => navigate(`/detailBook/${book._id._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={book._id.imageUrl}
                      className={classes.img}
                      alt=""
                    />
                    <div className="d-flex flex-column justify-content-between">
                      <h5>{book._id.title}</h5>
                      <p className="fw-medium">
                        {book._id.price.toLocaleString("vi-VN")}VND
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ flexBasis: "120px" }}>
                  <button className=" border bg-body-tertiary text-secondary">
                    <FontAwesomeIcon
                      icon={faMinus}
                      onClick={() =>
                        adjustProductQuantity(
                          book._id._id,
                          -1,
                          book.quantity,
                          book._id.count
                        )
                      }
                    />
                  </button>
                  <input
                    type="text"
                    value={book.quantity}
                    className={classes.number}
                    onChange={(event) =>
                      handleChange(
                        event,
                        book._id._id,
                        book.quantity,
                        book._id.count
                      )
                    }
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
                  />
                  {/* <input
                    type="text"
                    value={book.quantity}
                    ref={(element) =>
                      (quantityRefs.current[book._id._id] = element)
                    }
                    className={classes.number}
                    onChange={() =>
                      handleChange(book._id._id, book.quantity, book._id.count)
                    }
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
                  /> */}

                  <button className=" border bg-body-tertiary text-secondary">
                    <FontAwesomeIcon
                      icon={faPlus}
                      onClick={() =>
                        adjustProductQuantity(
                          book._id._id,
                          1,
                          book.quantity,
                          book._id.count
                        )
                      }
                    />
                  </button>
                </div>
                <div style={{ flexBasis: "120px" }} className="text-break">
                  {(book._id.price * book.quantity)?.toLocaleString("vi-VN")}VND
                </div>
                <div style={{ flexBasis: "120px" }}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className={classes.trash}
                    onClick={() => deleteItemCart(book._id._id, book.quantity)}
                  />
                </div>
              </div>
            ))}
          </Col>

          <Col lg={4} className="bg-white rounded-3 p-3 h-100">
            <p>
              <span className="fw-medium"> Thành tiền:</span>
              <span className="me-2">
                {totalPrice.toLocaleString("vi-VN")} VND
              </span>
            </p>
            <p>Tổng sản phẩm: {productSelected.length}</p>
            <Button
              variant="danger"
              className="w-100"
              onClick={navigateCheckout}
              disabled={productSelected.length === 0}
            >
              Thanh Toán
            </Button>
          </Col>
        </Row>
      ) : (
        <>
          <p>Không có sản phẩm nào trong giỏ hàng</p>
          <Button variant="danger" onClick={() => navigate("/")}>
            Mua sắnm ngay
          </Button>
        </>
      )}
    </>
  );
};

export default Cart;
