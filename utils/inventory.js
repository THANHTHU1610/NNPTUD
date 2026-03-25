const mongoose = require("mongoose");
const Inventory = require("../models/Inventory.model");
const Product = require("../models/Product.model");

/**
 * Tạo Product kèm theo Inventory tương ứng
 * @param {Object} productData - Dữ liệu của sản phẩm mới
 */
const createProductWithInventory = async (productData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Tạo Product
    const newProduct = await Product.create([productData], { session });
    const productId = newProduct[0]._id;

    // 2. Tạo Inventory tương ứng
    await Inventory.create([{ product: productId }], { session });

    // 3. Xác nhận hoàn tất (Commit)
    await session.commitTransaction();
    return newProduct[0];
  } catch (error) {
    // Nếu có lỗi, hủy bỏ mọi thay đổi (Rollback)
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { createProductWithInventory };
