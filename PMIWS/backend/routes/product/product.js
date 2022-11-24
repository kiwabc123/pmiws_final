

const router = require("express").Router();
const { check } = require("express-validator");
const service = require("../../services/product/product");
const serviceimage = require('../../services/image/image')
const servicesupplier = require('../../services/supplier/supplier');
const _ = require('underscore');



var cutimage = function (url) {
  idimage = url.map(s => s.slice(0, -5));
  return idimage
}
router.post(
  "/addproduct",
  // [
  //   check("detail").not().isEmpty(),check("price").not().isEmpty(),check("category").not().isEmpty(),check("supplier").not().isEmpty(),
  //   check("image").not().isEmpty()],
  async (req, res) => {
    try {
      req.validate();
      // console.info(req.body)
      obj=JSON.parse(JSON.stringify(req.body))
      console.info(obj.price)
     
      images = obj.image
      images_id = []
      id_sup = null

      for (var img = 0; img < images.length; img++) {

        id_img = await serviceimage.onInsert(images[img])
        // console.log("id", id_img.toString())
        images_id.push(id_img.toString())


      }
      // console.log(req.body.supplier)
      items = await servicesupplier.findByName(obj.supplier)
      // console.log(items)

      if (items === null) {
        // console.info("null")

        supplier = await servicesupplier.onInsert(obj.supplier)
        id_sup = supplier._id.toString()
        // console.log("idsub", id_sup._id.toString())
      } else {
        // console.info("no null")
        id_sup = items.id.toString()
        // console.log("no insert")
      }

      // console.log("img", images_id, " / ", "sup", id_sup)



      // console.log(images_id)
      product = await service.onInsert(obj, images_id, id_sup)
      res.json({ message: product });


      // res.json({ message: "aa"})
    } catch (err) {
      res.error(err);
    }
  }
);
router.post("/searchproduct", [], async (req, res) => {
  try {
    req.validate();
    product = await service.findproduct(req.body.search)
    // console.log(product)
    newproduct = {}

    for (var i = 0; i < product.length; i++) {

      // console.log(i,product[i].images,product[i].supplier.toString(),product[i].sup)

      id_image = await serviceimage.findMany(product[i].images)
      id_supplier = await servicesupplier.findOne(product[i].supplier.toString())
      product[i].sup = id_supplier

      product[i].images = (id_image)

      // console.log(i,  id_image ,product[i].sup)
    }
    // console.log(product[0].sup)
    //res.json( product ) 
    res.json(product)
  } catch (err) {
    res.error(err)
  }
})
  ,

  router.post("/search", [], async (req, res) => {
    try {
      const { image } = req.files;
      // console.log(req.files)
      if (!image) return res.sendStatus(400), console.log(1)
      if (!/^image/.test(image.mimetype)) return res.sendStatus(400), console.log(2);
      getid = await service.search(image)

      getproduct = await service.findproduct(getid)
      res.json(getproduct)
    } catch (err) {
      res.error(err)
    }
  })

router.get("/", [], async (req, res) => {
  try {
    const items = await service.findAll();
    //console.log(items)
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});



router.get("/byID", [], async (req, res) => {
  try {
    console.log("param",req.query.id)
    const items = await service.findOne(req.query.id);
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});

router.put(
  "/update",
  [
    check("detail").not().isEmpty(), check("price").not().isEmpty(), check("category").not().isEmpty(), check("supplier").not().isEmpty(), check("image_id").not().isEmpty()
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

module.exports = router;
