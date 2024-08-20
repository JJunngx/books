const router = require("express").Router();

const auth = require("../controller/auth");
router.post("/signup", auth.signup);
router.post("/login", auth.login);
module.exports = router;
