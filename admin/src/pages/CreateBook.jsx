import React from "react";
import BookForm from "../utils/BookForm";
import useAxios from "axios-hooks";
import { url } from "../utils/createData";
import { Helmet } from "react-helmet-async";
const CreateBook = () => {
  const [{ loading }, executePost] = useAxios(
    {
      url: `${url}admin/createBook`,
      method: "POST",
    },
    { manual: true }
  );
  const onSubmit = async (data) => {
    const formData = new FormData();
    for (let key in data) {
      if (key === "imageUrl") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    try {
      await executePost({ data: formData });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Book</title>
      </Helmet>
      <BookForm
        onSubmit={onSubmit}
        nameButton="Create Book"
        loading={loading}
      />
    </>
  );
};

export default CreateBook;
