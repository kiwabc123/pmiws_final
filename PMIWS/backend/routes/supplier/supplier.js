

    const router = require("express").Router();
    const { check } = require("express-validator");
    const service = require("../../services/supplier/supplier");
    
    router.post(
      "/addsupplier",
      [check("name").not().isEmpty(),check("contact").not().isEmpty()],
      async (req, res) => {
        try {
          req.validate();

          const item = await service.findByName(req.body)
          // console.log(item)
           
          if(item){
            throw new Error("already have the supplier");
            // res.json({ message: "already have the supplier" })

          }else{}
           res.json({ message: await service.onInsert(req.body) });
    
          // res.json({ message: item })
        } catch (err) {
          res.error(err);
        }
      }
    );
    router.get("/byIDs", [], async (req, res) => {
      try {
        console.log("param",req.query.id)
        const items = await service.findOne(req.query.id);
        res.json(items);
      } catch (err) {
        res.error(err);
      }
    });
    
    
    router.get("/", [], async (req, res) => {
      try {
        const items = await service.findAll();
        //console.log(items)
        res.json(items);
      } catch (err) {
        res.error(err);
      }
    });
    
    
    
    router.post("/byID", [], async (req, res) => {
      try {
        const items = await service.findOne(req.body.id);
        res.json(items);
      } catch (err) {
        res.error(err);
      }
    });
    router.post("/byname", [], async (req, res) => {
      try {
         items = await service.findByName(req.body);
         console.log(items)
         if(items){
          res.json({ message: items })
          return
         }
        
          res.json({ message: "The item is not in database " })
        //  
         res.json({ message: "The item is not in database " })
      } catch (err) {
        res.error(err);
      }
    });

    router.put(
      "/update",
      [
        check("name").not().isEmpty(),check("contact").not().isEmpty()
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
    