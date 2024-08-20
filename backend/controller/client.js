const Book = require("../model/book");
const User = require("../model/user");
const nodemailer = require("nodemailer");
const Order = require("../model/order");
exports.order = async (req, res, next) => {
  const { fullname, email, phone, totalPrice, books } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smpt.gmail.com",
    // port: 587,
    // secure: false,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  let mailOptions = {
    from: process.env.user,
    subject: "Thông tin đơn hàng của bạn",
    to: email,
    html: `
    <html>
    <head>
    <style>
    
    th,
   td {
  border: 1px solid yellow;

   margin: 5px;
   }
   table img {
    width:70px;
    height: 70px;
  }
  .fontSize{
    font-size:30px;
    font-weight:bold;
  }
  td{
    font-size:25px;
  }
  table {
  border-collapse: separate;
  border-spacing: 3px;
  width:80%
  } 
     p {
      color: white;
     }
     .order{
      padding:20px;
      max-width:80%;
      color: white;
     }
    </style>
     </head>
      <body style="background-color: black;color:white">
      <div class="order">
        <h1 class="fontSize">Xin Chào ${fullname}</h1>
        <p>Phone:${phone}</p>
        <p>Address:Ha Noi, Viet Nam</p>
        <table>
        <tr>
          <th>Tên Sản Phẩm</th>
          <th>Hình Ảnh</th>
          <th>Giá</th>
          <th>Số Lượng</th>
          <th>Thành Tiền</th>
        </tr>
        ${books
          .map(
            (book) => `
        <tr>
        <td>${book._id.title}</td>
        <td><img src=${book._id.imageUrl} alt=${book._id.title}/></td>
        <td>${book._id.price.toLocaleString("vi-VN")} VND</td>
        <td>${book.quantity}</td>
        <td>${(book._id.price * book.quantity).toLocaleString("vi-VN")} VND</td>
        </tr>`
          )
          .join("")}
      </table>
        <p class="fontSize">Tổng Thanh Toán:${totalPrice}VND</p>
        <p class="fontSize">Cảm ơn bạn!</p>
        </div>
      </body>
    </html>
  `,
  };
  try {
    await transporter.sendMail(mailOptions);
    req.body.userId = req.userId;
    req.body.books = books.map((book) => ({
      _id: book._id._id,
      quantity: book.quantity,
    }));
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "hóa đơn được tạo thành công" });
  } catch (error) {
    console.log(error);
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
exports.detailBook = async (req, res) => {
  try {
    const results = await Book.findById(req.params);
    console.log("sau");
    console.log(results);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.getCart = async (req, res, next) => {
  try {
    const cart = await User.findById(req.userId).populate("cart._id").exec();

    res.json(cart.cart);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.addBookCart = async (req, res, next) => {
  const { productId, quantity } = req.query;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId, "cart._id": productId },
      { $inc: { "cart.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedUser) {
      await User.findByIdAndUpdate(req.userId, {
        $push: { cart: { _id: productId, quantity } },
      });
    }

    //cập nhật lại số hàng trong kho
    await Book.updateOne({ _id: productId }, { $inc: { count: -quantity } });

    res.json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
exports.addBookCartInput = async (req, res) => {
  try {
    console.log(req.query);
    const { productId, quantity, numberOld } = req.query;
    await Book.updateOne({ _id: productId }, { $inc: { count: +numberOld } });
    await User.updateOne(
      {
        _id: req.userId,
        "cart._id": productId,
      },
      { "cart.$.quantity": quantity }
    );
    await Book.updateOne({ _id: productId }, { $inc: { count: -quantity } });
    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.deleteItemCart = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.query;
  console.log(req.params, req.query, req.userId);
  try {
    await User.findOneAndUpdate(
      { _id: req.userId },
      { $pull: { cart: { _id: productId } } },
      { new: true }
    );
    //cập nhật lại số luợng trong kho khi người dùng xóa sp ở giỏ hàng
    await Book.updateOne({ _id: productId }, { $inc: { count: quantity } });
    res.json({ message: "xoa sp thanh cong" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
exports.history = async (req, res, next) => {
  const { currentPage, itemsPerPage } = req.query;
  try {
    const totalCount = await Order.find({
      userId: req.userId,
    }).countDocuments();

    const results = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.json({ results, totalCount });
  } catch (error) {
    console.log(error);
  }
};
exports.detailOrder = async (req, res) => {
  try {
    const results = await Order.findById(req.params)
      .populate("books._id")
      .exec();

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
