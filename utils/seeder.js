const productModel = require("../schemas/products");
const inventoryModel = require("../schemas/inventories");
const categoryModel = require("../schemas/categories"); // Đảm bảo đường dẫn này đúng
const allData = require("./data");
const slugify = require("slugify");

module.exports = async () => {
  try {
    // 1. Kiểm tra xem đã có dữ liệu chưa
    const productCount = await productModel.countDocuments();
    if (productCount > 0) return;

    console.log("--- Database trống. Bắt đầu nạp dữ liệu mẫu ---");

    // 2. Nạp Categories trước
    const categoryMap = {}; // Dùng để lưu lại _id của Category vừa tạo
    const categoriesToSeed = allData.dataCategories;

    for (let cat of categoriesToSeed) {
      // Kiểm tra xem category đã tồn tại trong DB chưa (tránh lỗi unique name)
      let existingCat = await categoryModel.findOne({ name: cat.name });

      if (!existingCat) {
        existingCat = await categoryModel.create({
          name: cat.name,
          slug: cat.slug || slugify(cat.name, { lower: true }),
          image: cat.image,
        });
      }
      // Lưu vào map: key là ID cũ (1, 2) -> value là _id mới của MongoDB
      categoryMap[cat.id] = existingCat._id;
    }
    console.log("--- Đã nạp xong Categories ---");

    // 3. Nạp Products và Inventory
    const productsToSeed = allData.dataProducts;

    for (let item of productsToSeed) {
      // Lấy _id thật từ categoryMap dựa trên id (1, 2...) trong data.js
      const realCategoryId = categoryMap[item.category.id];

      const newProduct = await productModel.create({
        title: item.title,
        price: item.price,
        description: item.description,
        images: item.images,
        slug: item.slug || slugify(item.title, { lower: true }),
        category: realCategoryId, // Gán ID thật đã tạo ở bước trên
      });

      // 4. Tạo Inventory tương ứng
      await inventoryModel.create({
        product: newProduct._id,
        stock: 100,
        reserved: 0,
        soldCount: 0,
      });
    }

    console.log("--- Nạp dữ liệu Product & Inventory thành công! ---");
  } catch (error) {
    console.error("Lỗi khi nạp dữ liệu mẫu:", error);
  }
};
