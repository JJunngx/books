const router = require("express").Router();
const client = require("../controller/client");
const authenticateToken = require("../middleware/authToken");
router.get("/books", client.books);
router.get("/searchBook", client.searchBook);
router.get("/detailBook/:_id", client.detailBook);
router.get("/getCart", authenticateToken, client.getCart);
router.get("/addBookCart", authenticateToken, client.addBookCart);
router.get("/addBookCartInput", authenticateToken, client.addBookCartInput);
router.delete(
  "/deleteItemCart/:productId",
  authenticateToken,
  client.deleteItemCart
);
router.post("/order", authenticateToken, client.order);
router.get("/history", authenticateToken, client.history);
router.get("/detailOrder/:_id", client.detailOrder);
module.exports = router;
