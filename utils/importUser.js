const exceljs = require('exceljs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userModel = require('../schemas/users');

// Hàm tạo khoảng dừng (tính bằng milisecond)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ddab265e1627ff",
    pass: "7c2bcfb12eb36f"
  }
});

async function importUsersFromExcel(filePath) {
  try {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    console.log("--- Bắt đầu Import User (Có độ trễ để tránh lỗi Mailtrap) ---");

    // Lấy đại một ID role từ Compass dán vào đây (như bước trước)
    const DEFAULT_ROLE_ID = "65f1234567890abcdef12345"; 

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const username = row.getCell(1).value;
      let emailCell = row.getCell(2).value;

      let email = (typeof emailCell === 'object' && emailCell !== null) 
                  ? (emailCell.result || emailCell.text || "") 
                  : emailCell;

      if (!username || !email) continue;

      const rawPassword = crypto.randomBytes(8).toString('hex');
      const hashPassword = await bcrypt.hash(rawPassword, 10);

      // 1. Lưu DB
      await userModel.create({
        username: username,
        email: email,
        password: hashPassword,
        role: DEFAULT_ROLE_ID
      });

      // 2. Gửi Email
      await transporter.sendMail({
        from: '"Admin" <admin@test.com>',
        to: email,
        subject: "Tài khoản mới",
        html: `<p>Chào ${username}, mật khẩu của bạn là: <strong>${rawPassword}</strong></p>`
      });

      console.log(`- Đã gửi xong: ${username}`);

      // 3. NGHỈ 1.5 GIÂY TRƯỚC KHI GỬI TIẾP (Để không bị Mailtrap chặn)
      await sleep(1500); 
    }

    console.log("--- Hoàn thành! Đã có đủ ảnh nộp bài ---");
  } catch (error) {
    console.error("Lỗi Import:", error.message);
  }
}

module.exports = importUsersFromExcel;