import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Container, Stack } from "react-bootstrap";
import classes from "./Root.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faBook,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import cookie from "js-cookie";

const Root = () => {
  const navigate = useNavigate();
  const token = cookie.get("login-admin");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const LiNavLink = ({ link, name, icon }) => (
    <div>
      <NavLink
        to={link}
        className={({ isActive }) => (isActive ? classes.active : null)}
      >
        {icon && <FontAwesomeIcon icon={icon} />}
        {name}
      </NavLink>
    </div>
  );

  const logout = () => {
    cookie.remove("login-admin");
    navigate("/");
  };
  return (
    <Container>
      <nav className="mb-5 mt-2">
        <Stack direction="horizontal" className={classes.list} gap={5}>
          <LiNavLink link="/" name="Books" icon={faBook} />
          <LiNavLink link="createBook" name="Create Book" icon={faPlus} />
          <div onClick={logout} className={classes.logout}>
            <FontAwesomeIcon icon={faRightToBracket} /> logout
          </div>
        </Stack>
      </nav>
      <Outlet />
    </Container>
  );
};

export default Root;
