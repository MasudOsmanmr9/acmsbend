var express = require("express");
var router = express.Router();
const adminService = require("../admin/admin-service");


router.post("/listData", async function (req, res, next) {
  try {
    let { pageSize, lastKey, type, filter, whereObj, cols } = req.body;
   // console.log('accccccccccccesssing',type);
    let result = await adminService.getListData(pageSize, lastKey, type, filter, whereObj, cols);
    return res.send(result);
  } catch (error) {
    return res.send({
      Success: false,
      Message: error,
    });
  }
});

router.get("/details/:type/:id", async function (req, res, next) {
  try {
    let type = req.params.type;
    let id = req.params.id;
    let result = await adminService.getDataDetails(type, {
      id: id,
    });
    return res.send(result);
  } catch (error) {
    return res.send({
      Success: false,
      Message: error,
    });
  }
});


router.post("/updateData", async function (req, res, next) {
  try {
    let { data, type, id } = req.body;

    data.___type=type;
    data.lastModified = data.lastModified ? data.lastModified : new Date().getTime();
    // data.lastModifiedBy = req.user.id;

    let result = await adminService.updateData(data, type, id);
    return res.send(result);
  } catch (error) {
    return res.send({
      Success: false,
      Message: error,
    });
  }
});

router.post("/saveOrUpdateData", async function (req, res, next) {
  try {
    let { data, type} = req.body;
    console.log('acccessssssssing here',req.body,data,type);
    data.___type=type;
    let result = await adminService.saveOrUpdateData(data, req);
    return res.send(result);
  } catch (error) {
    return res.send({
      Success: false,
      Message: error,
    });
  }
});



module.exports = router;
