import { useState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import classes from "./Input.module.css";
const Input = ({ inputArr }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    const isErrorShown = inputArr.some((input) => input.errors[input.typeName]);
    setErrorShown(isErrorShown);
  }, [inputArr]);
  return (
    <>
      {inputArr.map((input) => (
        <div key={input.typeName}>
          {input.typeName !== "password" ? (
            <>
              <label>{input.label}</label>
              <input
                type={input.type}
                placeholder={input.placeholder}
                {...input.register}
                className={`form-control mb-3 shadow-none ${
                  errorShown && input.errors[input.typeName]
                    ? classes.error
                    : ""
                }`}
              />
            </>
          ) : (
            <>
              <label>{input.label}</label>

              <div
                className={`d-flex align-items-center border border-secondary-subtle rounded-2 ${
                  errorShown && input.errors[input.typeName]
                    ? classes.error
                    : ""
                }`}
                tabIndex="0"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={input.placeholder}
                  {...input.register}
                  className={`flex-fill rounded-2  ${classes.password}  `}

                  // className={error && error?.password ? "border border-danger" : ""}
                />
                {showPassword ? (
                  <FontAwesomeIcon
                    icon={faEye}
                    className="me-2"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    onClick={() => setShowPassword(true)}
                    className="me-2"
                  />
                )}
              </div>
            </>
          )}

          {input.type === "text" ? (
            <ErrorMessage
              errors={input.errors}
              name={input.typeName}
              render={({ message }) => <p className="text-danger">{message}</p>}
            />
          ) : (
            <ErrorMessage
              errors={input.errors}
              name={input.typeName}
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p key={type} className="text-danger">
                    {message}
                  </p>
                ))
              }
            />
          )}
        </div>
      ))}
    </>
  );
};

export default Input;
