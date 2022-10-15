
var express = require("express");
var router = express.Router();


router.get("/", async function (req, res, next) {

  res.send({
    Success: true,
    Message: "Welcome to the CMS API",
  });
});


module.exports = router;
