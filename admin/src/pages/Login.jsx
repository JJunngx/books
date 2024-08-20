import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Input from "../utils/Input";
import createData from "../utils/createData";
import useAxios from "axios-hooks";
import { url } from "../utils/createData";
import Cookies from "js-cookie";
const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ criteriaMode: "all" });
  const [{ data, loading }, executePost] = useAxios(
    {
      url: `${url}admin/login`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const navigate = useNavigate();
  const getToken = Cookies.get("login-admin");
  useEffect(() => {
    if (data) {
      Cookies.set("login-admin", data);
      navigate("/");
    } else if (getToken) {
      navigate("/");
    }
  }, [data, getToken, navigate]);

  const onSubmit = async (data) => {
    try {
      await executePost({ data });
    } catch (error) {
      error.email &&
        setError("email", {
          type: "server",
          message: error.message,
          types: { required: error.email },
        });
      error.password &&
        setError("password", {
          type: "server",
          message: error.message,
          types: { required: error.password },
        });
    }
  };
  const loginInput = [
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
      "Password",
      "",
      "password",
      "Your Password",
      register("password", {
        required: "required",
        minLength: {
          value: 8,
          message: "Password must be at least 6 characters",
        },
        pattern: {
          value:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
          message:
            "mật khẩu phải có kí tự viết hoa,viết thường và kí tự đặc biệt",
        },
      }),
      errors
    ),
  ];
  return (
    <>
      <Helmet>
        <title>log in</title>
      </Helmet>
      <div
        className="d-flex justify-content-center "
        style={{ marginTop: "150px" }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-25 shadow p-3 rounded"
        >
          <Input inputArr={loginInput} />
          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-5 mt-3"
            disabled={loading}
          >
            Log in
          </Button>
        </form>
      </div>
    </>
  );
};

export default Login;
