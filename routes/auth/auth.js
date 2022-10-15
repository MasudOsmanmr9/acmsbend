require('dotenv').config()
var express = require("express");
var router = express.Router();
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const authService = require("../auth/auth-service");

router.use(function timeLog(req, res, next) {
  next();
});

router.post("/login", async function (req, res) {
  try {
    // let { username, password } = req.body;
    //// TODO : IMPLEMENT LOGIN LOGIC HERE

    let userCredential = req.body;
    delete req.body.device;
    let user = await authService.getDataDetails('users', userCredential);
    if (user != undefined && user.Success) {

      let obj = {};
      obj.id = user.Data.id;
      obj.useremail = user.Data.useremail;
      const accesstoken = generateAccessToken(obj);
      // user.accesstoken = accesstoken;
      let data = {
        user : user.Data,
        accesstoken : accesstoken,
      }

      let filter = createCollectionFilter(user.Data.userCollectionAccess);
      let accessCollectionList = await authService.getListData(null,0,'collection',filter,null,null)
      if(accessCollectionList && accessCollectionList.Success){
        data.user.accessCollectionList = accessCollectionList.Data;
      }
      
      data.user
      res.status(200).json({Success:true,Data:data});
    } else {
      res.status(process.env.API_OK).json({
        Success: false,
        Message: 'No data found'
      });
    }


  } catch (e) {
    console.error(e);
    res.send({
      Success: false,
      Message: e.message,
      From: " auth",
    });
  }
});

function generateAccessToken(user) {
  const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
  return accesstoken;
}

function createCollectionFilter(itemIds) {
  let whereClause = 'c.id in (';
  if (Array.isArray(itemIds) && itemIds.length) {
    itemIds.forEach((element, i) => {
      whereClause += `'${element}'` + (i != itemIds.length - 1 ? ',' : ')');
    });
  } else {
    return;
  }

  return whereClause;
}

module.exports = router;
