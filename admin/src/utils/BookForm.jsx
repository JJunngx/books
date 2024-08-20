import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import Input from "./Input";
import { useForm } from "react-hook-form";
import createData from "./createData";

const BookForm = ({ onSubmit, loading, book, nameButton }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ criteriaMode: "all" });
  useEffect(() => {
    if (!book) return;
    setValue("title", book.title);
    setValue("author", book.author);
    setValue("description", book.description);
    setValue("genre", book.genre);
    setValue("price", book.price);
    setValue("count", book.count);
  }, [setValue, book]);
  const inputBook = [
    createData(
      "Title",
      "text",
      "title",
      "Enter title",
      register("title", { required: "required" }),
      errors
    ),
    createData(
      "Author",
      "text",
      "author",
      "Enter Author",
      register("author", { required: "required" }),
      errors
    ),

    createData(
      "Genre",
      "text",
      "genre",
      "Enter genre",
      register("genre", { required: "required" }),
      errors
    ),
    createData(
      "Price",
      "number",
      "price",
      "Enter Price",
      register("price", {
        required: "required",
        min: { value: 1, message: "số lượng trên ít nhất là 1" },
      }),
      errors
    ),
    createData(
      "Số lượng sản phẩm",
      "number",
      "count",
      "Enter Count",
      register("count", {
        required: "required",
        min: { value: 1, message: "số lượng trên ít nhất là 1" },
      }),
      errors
    ),
    createData(
      "Image",
      "file",
      "imageUrl",
      "select image",
      register("imageUrl", { required: "required" }),
      errors
    ),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input inputArr={inputBook} />
      <label>Description</label>
      <textarea
        {...register("description", { required: "required" })}
        rows="5"
        className="form-control mb-3"
      ></textarea>
      <Button variant="primary" type="submit" disabled={loading}>
        {nameButton}
      </Button>
    </form>
  );
};

export default BookForm;
