const router = require("express").Router();
const admin = require("../controller/admin");

router.post("/login", admin.login);
router.post("/createBook", admin.createBook);
router.get("/books", admin.books);
router.get("/searchBook", admin.searchBook);
router.delete("/deleteBook/:_id", admin.deleteBook);
router.get("/getEditBook/:_id", admin.getEditBook);
router.put("/editBook", admin.editBook);
module.exports = router;
