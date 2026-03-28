<<<<<<< HEAD
let mongoose = require('mongoose');

let inventorySchema = mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        min: 0,
        default: 0
    },
    reserved: {
        type: Number,
        min: 0,
        default: 0
    },
    soldCount: {
        type: Number,
        min: 0,
        default: 0
    }
})
module.exports = new mongoose.model('inventory',inventorySchema)
=======
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      min: 0,
    },
    reserved: {
      type: Number,
      min: 0,
    },
    soldCount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("inventory", inventorySchema);
>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8
