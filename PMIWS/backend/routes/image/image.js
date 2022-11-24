const router = require("express").Router();
const { check } = require("express-validator");
const service = require("../../services/image/image");
const fs = require('fs');
const request = require('request');
const { Server } = require("http");

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });

};

router.post(
  "/addimage",
  [check("imageURL").not().isEmpty()],
  async (req, res) => {
    try {
      req.validate();



      const addimg = await service.onInsert(req.body)   //   // res.json({ message: await service.onInsert(req.body) });
      res.json({ message: 'complete' });
      // console.log(addimg.status._id.toString())
      // // res.json({ message: item })
    } catch (err) {
      res.error(err);
    }
  }
);




router.get("/", [], async (req, res) => {
  try {
    const items = await service.findAll();
    //console.log(items)
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});

router.post("/byIDs", [], async (req, res) => {
  try {

    const items = await service.findMany(req.body.images);
    res.json(items);

  } catch (err) {
    res.error(err);
  }
});

router.get("/byID", [], async (req, res) => {
  try {
    const items = await service.findOne(req.params.id);
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});

router.put(
  "/update",
  [
    check("imageURL").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      req.validate();
      const updateItem = await service.onUpdateData(req.body);
      res.json(updateItem);
    } catch (err) {
      res.error(err);
    }
  }
);

router.delete("/", async (req, res) => {
  // console.log(req.query)
  try {
    const item = await service.findOne(req.query);
    console.log(item)
    if (!item) {
      throw new Error("Not found item.");
    } else {
      const deleteItem = await service.onDelete(item);
      // console.log("complete")
      res.json(deleteItem);
    }
  } catch (err) {
    res.error(err);
  }
});
// const a =require("../../dataset")
router.get('/dataset/*', function (req, res) {
  // console.log("start get export file :"+req.url);
  var path = require('path');
  var defpath = path.join(__dirname, '../../'+req.url);
  
  res.sendFile(defpath);
 
});


router.post("/reset", async (req, res) => {
  try {
    // console.log(req.body.delete)
    res.json(await service.onReset(req.body.delete))
    // res.send("test")
  } catch (err) {
    res.error(err);
  }
})

module.exports = router;
