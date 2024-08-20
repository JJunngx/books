const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Book = require("../model/book");
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại " });
    if (user.role !== "Admin")
      return res.status(400).json({ message: "Không có quyền đăng nhập" });
    const isPasswordMath = bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMath)
      return res.status(400).json({ message: "sai mật khẩu" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_admin);
    res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
// exports.createBook = async (req, res) => {
//   try {
//     const results = await cloudinary.uploader.upload(req.file.path);

//     req.body.imageUrl = results.secure_url;
//     console.log(req.body.imageUrl);
//     const newBook = new Book(req.body);
//     await newBook.save();
//     res.status(201).json({ message: "tạo sản phẩm thành công" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error });
//   }
// };
exports.createBook = async (req, res) => {
  try {
    console.log(req.file);
    const b64 = Buffer.from(req.file.buffer).toString("base64");

    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const results = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
    req.body.imageUrl = results.secure_url;

    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({ message: "tạo sản phẩm thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.books = async (req, res) => {
  const { currentPage, itemsPerPage } = req.query;
  try {
    const totalCount = await Book.estimatedDocumentCount();
    const results = await Book.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);
    res.json({ results, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.searchBook = async (req, res) => {
  const { keyword } = req.query;
  const currentPage = +req.query.currentPage;
  const itemsPerPage = +req.query.itemsPerPage;

  try {
    const results = await Book.aggregate([
      {
        $facet: {
          totalCount: [
            {
              $match: {
                title: { $regex: keyword, $options: "i" },
              },
            },
            { $count: "value" },
          ],
          data: [
            {
              $match: {
                title: { $regex: keyword, $options: "i" },
              },
            },
            { $skip: (currentPage - 1) * itemsPerPage },
            { $limit: itemsPerPage },
          ],
        },
      },
    ]);

    if (results[0].data.length === 0) {
      res.json({
        results: [],
        totalCount: 0,
      });
    } else {
      res.json({
        results: results[0].data,
        totalCount: results[0].totalCount[0].value,
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
exports.deleteBook = async (req, res) => {
  try {
    const image = await Book.findById(req.params, { imageUrl: 1 });
    const imageUrl = image.imageUrl;
    const deleteImage = await cloudinary.uploader.destroy(
      imageUrl.substring(
        imageUrl.lastIndexOf("/") + 1,
        imageUrl.lastIndexOf(".")
      )
    );
    console.log("Đã xóa hình ảnh thành công:", deleteImage);
    await Book.deleteOne(req.params);
    res.json("xóa sản phẩm thành công");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.getEditBook = async (req, res) => {
  try {
    const results = await Book.findById(req.params);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.editBook = async (req, res) => {
  try {
    const image = await Book.findById(req.body._id, { imageUrl: 1 });
    const imageUrl = image.imageUrl;
    const deleteImage = await cloudinary.uploader.destroy(
      imageUrl.substring(
        imageUrl.lastIndexOf("/") + 1,
        imageUrl.lastIndexOf(".")
      )
    );
    console.log(deleteImage);
    const newImageUrl = await cloudinary.uploader.upload(req.file.path, {
      public_id: `book_image${Date.now()}`,
    });
    req.body.imageUrl = newImageUrl.secure_url;
    await Book.updateOne({ _id: req.body._id }, req.body);

    res.json({ message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
