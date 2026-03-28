<<<<<<< HEAD
//inventory
//cart
//reservation
//payments
var express = require('express');
var router = express.Router();
const slugify = require('slugify');
let productModel = require('../schemas/products')
let inventoryModel = require('../schemas/inventories');
const products = require('../schemas/products');
let mongoose = require('mongoose')
=======
var express = require("express");
var router = express.Router();
const slugify = require("slugify");
let productModel = require("../schemas/products");
let inventoryModel = require("../schemas/inventories");
>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let queries = req.query;
  let titleQ = queries.title ? queries.title : "";
  let minPrice = queries.min ? queries.min : 0;
  let maxPrice = queries.max ? queries.max : 1000000;
  console.log(queries);
  let result = await productModel
    .find({
      isDeleted: false,
      title: new RegExp(titleQ, "i"),
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    })
    .populate({
      path: "category",
      select: "name",
    });
  res.send(result);
});
///api/v1/products/id
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findById(id);
    if (!result || result.isDeleted) {
      res.status(404).send({
        message: "ID NOT FOUND",
      });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND",
    });
  }
});
<<<<<<< HEAD
router.post('/', async function (req, res, next) {
  let session = await mongoose.startSession()
  session.startTransaction()
=======
router.post("/", async function (req, res, next) {
>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title, {
<<<<<<< HEAD
        replacement: '-',
        remove: undefined,
        lower: true
=======
        replacement: "-",
        remove: undefined,
        lower: true,
>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8
      }),
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
<<<<<<< HEAD
      category: req.body.category
    })
    await newProduct.save({ session })
    let newInventory = new inventoryModel({
      product: newProduct._id,
      stock: 0
    })
    await newInventory.save({ session });
    await newInventory.populate('product')
    await session.commitTransaction();
    await session.endSession()
    res.send(newInventory)
  } catch (error) {
    await session.abortTransaction();
    await session.endSession()
    res.status(404).send(error.message)
  }
})
router.put('/:id', async function (req, res, next) {
=======
      category: req.body.category,
    });
    await newProduct.save();

    let newInventory = new inventoryModel({
      product: newProduct._id,
      stock: 0,
      reserved: 0,
      soldCount: 0,
    });
    await newInventory.save();

    res.send({ product: newProduct, inventory: newInventory });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.put("/:id", async function (req, res, next) {
>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8
  //cach 1
  // try {
  //   let id = req.params.id;
  //   let result = await productModel.findById(id);
  //   if (!result || result.isDeleted) {
  //     res.status(404).send({
  //       message: "ID NOT FOUND"
  //     });
  //   } else {
  //     let keys = Object.keys(req.body);
  //     for (const key of keys) {
  //       result[key] = req.body[key];
  //     }
  //     await result.save();
  //     res.send(result)
  //   }
  // } catch (error) {
  //   res.status(404).send({
  //     message: "ID NOT FOUND"
  //   });
  // }
  //cach 2
  try {
    let id = req.params.id;
    let result = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send(result);
  } catch (error) {
    res.status(404).send(error);
  }
});
router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findById(id);
    if (!result || result.isDeleted) {
      res.status(404).send({
        message: "ID NOT FOUND",
      });
    } else {
      result.isDeleted = true;
      await result.save();
      res.send(result);
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND",
    });
  }
});
module.exports = router;
