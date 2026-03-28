var express = require("express");
var router = express.Router();
let inventoryModel = require("../schemas/inventories");

/* GET all inventories with product join */
router.get("/", async function (req, res, next) {
  let result = await inventoryModel.find().populate("product");
  res.send(result);
});

/* GET inventory by ID with product join */
router.get("/:id", async function (req, res, next) {
  try {
    let result = await inventoryModel
      .findById(req.params.id)
      .populate("product");
    if (!result) return res.status(404).send({ message: "NOT FOUND" });
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

/* POST: Add_stock {product_id, quantity} */
router.post("/add-stock", async function (req, res, next) {
  const { product, quantity } = req.body;
  let result = await inventoryModel.findOneAndUpdate(
    { product: product },
    { $inc: { stock: quantity } },
    { new: true },
  );
  res.send(result);
});

/* POST: Remove_stock {product_id, quantity} */
router.post("/remove-stock", async function (req, res, next) {
  const { product, quantity } = req.body;
  let result = await inventoryModel.findOneAndUpdate(
    { product: product, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true },
  );
  if (!result) return res.status(400).send({ message: "Stock không đủ" });
  res.send(result);
});

/* POST: Reservation {product_id, quantity} (Stock -> Reserved) */
router.post("/reservation", async function (req, res, next) {
  const { product, quantity } = req.body;
  let result = await inventoryModel.findOneAndUpdate(
    { product: product, stock: { $gte: quantity } },
    { $inc: { stock: -quantity, reserved: quantity } },
    { new: true },
  );
  if (!result) return res.status(400).send({ message: "Không đủ hàng để giữ" });
  res.send(result);
});

/* POST: Sold {product_id, quantity} (Reserved -> SoldCount) */
router.post("/sold", async function (req, res, next) {
  const { product, quantity } = req.body;
  let result = await inventoryModel.findOneAndUpdate(
    { product: product, reserved: { $gte: quantity } },
    { $inc: { reserved: -quantity, soldCount: quantity } },
    { new: true },
  );
  if (!result)
    return res.status(400).send({ message: "Lượng hàng đặt trước không đủ" });
  res.send(result);
});

module.exports = router;
