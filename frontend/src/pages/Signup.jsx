import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import createData from "../utils/CreateData";
import { url } from "../utils/CreateData";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Input from "../utils/Input";
import useAxios from "axios-hooks";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });
  const [{ loading }, executePost] = useAxios(
    {
      url: `${url}signup`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const onSubmit = async (data) => {
    try {
      await executePost({ data });
      navigate("/login");
    } catch (error) {
      // Kiểm tra nếu error có giá trị thì mới xử lý
      error.email &&
        setError("email", {
          type: "server",
          message: error.response.data.message,
          types: { required: error.response.data.message },
        });
    }
  };

  const signupInput = [
    createData(
      "Firstname",
      "text",
      "firstname",
      "Your firstname",
      register("firstname", { required: "required" }),
      errors
    ),
    createData(
      "Lastname",
      "text",
      "lastname",
      "Your lastname",
      register("lastname", { required: "required" }),
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
      "Password",
      "password",
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
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      }),
      errors
    ),
  ];

  return (
    <>
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      <div className="d-flex justify-content-center mt-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-25 shadow p-3 rounded bg-white"
        >
          <Input inputArr={signupInput} />
          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-5 mt-3"
            disabled={loading}
          >
            Sign up
          </Button>
          <p className="text-center">
            <Link to="/login" className="text-decoration-none text-center mt-2">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
