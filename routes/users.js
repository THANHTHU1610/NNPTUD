var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

const User = require("../schemas/users");

// CREATE USER
router.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();

  res.send(user);
});

// GET ALL USER
router.get("/", async (req, res) => {
  const users = await User.find({ isDeleted: false }).populate("role");

  res.send(users);
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("role");

  res.send(user);
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.send(user);
});

// DELETE USER (SOFT DELETE)
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true },
  );

  res.send(user);
});

/* ENABLE USER */

router.post("/enable", async (req, res) => {
  const { email, username } = req.body;

  const user = await User.findOne({
    email,
    username,
  });

  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  user.status = true;

  await user.save();

  res.send(user);
});

/* DISABLE USER */

router.post("/disable", async (req, res) => {
  const { email, username } = req.body;

  const user = await User.findOne({
    email,
    username,
  });

  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  user.status = false;

  await user.save();

  res.send(user);
});

module.exports = router;
