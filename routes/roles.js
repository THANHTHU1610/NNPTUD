var express = require("express");
var router = express.Router();

const Role = require("../schemas/roles");
const User = require("../schemas/users");

// CREATE ROLE
router.post("/", async (req, res) => {
  const role = new Role(req.body);
  await role.save();

  res.send(role);
});

// GET ALL ROLE
router.get("/", async (req, res) => {
  const roles = await Role.find();
  res.send(roles);
});

// GET ROLE BY ID
router.get("/:id", async (req, res) => {
  const role = await Role.findById(req.params.id);
  res.send(role);
});

// UPDATE ROLE
router.put("/:id", async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.send(role);
});

// DELETE ROLE
router.delete("/:id", async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);

  res.send({
    message: "Role deleted",
  });
});

// GET USERS BY ROLE
router.get("/:id/users", async (req, res) => {
  const users = await User.find({
    role: req.params.id,
    isDeleted: false,
  }).populate("role");

  res.send(users);
});

module.exports = router;
