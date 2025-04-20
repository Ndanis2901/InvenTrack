const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 引入用户模型
const User = require("../models/User");

// 连接到MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/inventrackDB")
  .then(() => console.log("MongoDB连接成功，准备创建管理员账号"))
  .catch((err) => {
    console.error("MongoDB连接失败:", err);
    process.exit(1);
  });

// 管理员账号信息
const adminData = {
  name: process.argv[2] || "Admin User",
  email: process.argv[3] || "admin@inventrack.com",
  password: process.argv[4] || "admin123",
  role: "admin",
};

async function createAdminUser() {
  try {
    // 检查是否已存在同名邮箱账号
    const existingUser = await User.findOne({ email: adminData.email });

    if (existingUser) {
      console.log(`邮箱为 ${adminData.email} 的用户已存在。`);

      // 如果已存在但不是管理员，则更新为管理员
      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        await existingUser.save();
        console.log(`已将用户 ${adminData.email} 的角色更新为管理员`);
      } else {
        console.log(`用户 ${adminData.email} 已经是管理员`);
      }
    } else {
      // 创建新管理员用户
      const user = await User.create(adminData);
      console.log(
        `管理员账号创建成功！\n姓名: ${user.name}\n邮箱: ${user.email}\n密码: ${adminData.password}\n角色: ${user.role}`
      );
    }

    // 关闭数据库连接
    mongoose.connection.close();
  } catch (error) {
    console.error("创建管理员账号时出错:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

createAdminUser();
