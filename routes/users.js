var express = require("express");
var router = express.Router();

let { dataUsers, dataRoles } = require("../utils/data");
let { genID } = require("../utils/idHandler");

/**
 * GET ALL USERS (not deleted)
 */
router.get("/", (req, res) => {
  const users = dataUsers.filter(u => !u.isDeleted);
  res.json(users);
});

/**
 * GET USER BY ID
 */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = dataUsers.find(
    u => u.id === id && !u.isDeleted
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

/**
 * CREATE USER
 */
router.post("/", (req, res) => {
  try {
    const { username, password, email, roleId } = req.body;

    if (!username || !password || !email || !roleId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newUser = {
      id: Date.now(),   // bỏ genID cho khỏi nghi ngờ
      username,
      password,
      email,
      roleId: Number(roleId),
      isDeleted: false
    };

    dataUsers.push(newUser);

    return res.status(201).json(newUser);

  } catch (err) {
    console.log("ERROR HERE:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE USER
 */
router.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const { username, password, email, roleId } = req.body;

    const userIndex = dataUsers.findIndex(
      u => u.id === id && !u.isDeleted
    );

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    if (roleId) {
      const roleExists = dataRoles.find(
        r => r.id === Number(roleId) && !r.isDeleted
      );

      if (!roleExists) {
        return res.status(400).json({ message: "Role not found" });
      }

      dataUsers[userIndex].roleId = Number(roleId);
    }

    if (username) dataUsers[userIndex].username = username;
    if (password) dataUsers[userIndex].password = password;
    if (email) dataUsers[userIndex].email = email;

    res.json(dataUsers[userIndex]);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * DELETE USER (soft delete)
 */
router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = dataUsers.find(
      u => u.id === id && !u.isDeleted
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = true;

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;