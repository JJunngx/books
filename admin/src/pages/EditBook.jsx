import React from "react";
import { useParams } from "react-router-dom";
import BookForm from "../utils/BookForm";
import useAxios from "axios-hooks";
import { url } from "../utils/createData";
import { Helmet } from "react-helmet-async";
const EditBook = () => {
  const { id } = useParams();
  const [{ data: book = {} }] = useAxios(`${url}admin/getEditBook/${id}`);

  const [{ loading }, executePost] = useAxios(
    { url: `${url}admin/editBook`, method: "PUT" },
    { manual: true }
  );

  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log(data);

    for (let key in data) {
      if (key === "imageUrl") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    formData.append("_id", id);
    try {
      await executePost({ data: formData });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {book.title && (
        <Helmet>
          <title>Edit Book | {book.title}</title>
        </Helmet>
      )}
      <BookForm
        onSubmit={onSubmit}
        nameButton={"Edit Book "}
        book={book}
        loading={loading}
      />
    </>
  );
};

export default EditBook;
