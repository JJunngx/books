import React, { useRef, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import classes from "./Root.module.css";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRightToBracket,
  faCartShopping,
  faMagnifyingGlass,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Stack, Button } from "react-bootstrap";
import { searchContext } from "../context/seachContext";

const Root = () => {
  const token = Cookies.get("login");
  const navigate = useNavigate();
  const searchRef = useRef();
  const { setKeyword } = useContext(searchContext);
  const LiNavLink = ({ link, name, icon }) => (
    <div>
      <NavLink
        to={link}
        className={({ isActive }) => (isActive ? classes.active : undefined)}
      >
        {icon && <FontAwesomeIcon icon={icon} />} {name}
      </NavLink>
    </div>
  );
  const logout = () => {
    Cookies.remove("login");
    navigate("/login");
  };
  const searchBookHandle = (e) => {
    e.preventDefault();
    const keyword = searchRef.current.value;
    if (!keyword) {
      searchRef.current.focus();
      return;
    }
    setKeyword(keyword);
    navigate("/searchBook");
  };

  return (
    <div>
      <div className="py-3 bg-white fixed-top ">
        <Container>
          <nav>
            <Stack direction="horizontal" gap={3} className={classes.list}>
              <LiNavLink link="/" name="Home" icon={faHouse} />
              <form onSubmit={searchBookHandle} className="d-flex flex-fill">
                <input
                  type="search"
                  className="form-control flex-grow-1"
                  ref={searchRef}
                />
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
              </form>
              <LiNavLink link="cart" name="Cart" icon={faCartShopping} />
              {token ? (
                <>
                  <LiNavLink
                    link="history"
                    name="History"
                    icon={faClockRotateLeft}
                  />
                  <div onClick={logout} style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faRightToBracket} /> Logout
                  </div>
                </>
              ) : (
                <>
                  <LiNavLink
                    link="login"
                    name="Log in"
                    icon={faRightToBracket}
                  />
                  <LiNavLink link="signup" name="Sign up" />
                </>
              )}
            </Stack>
          </nav>
        </Container>
      </div>
      <Container style={{ marginTop: "150px" }}>
        <Outlet />
      </Container>
    </div>
  );
};

export default Root;
