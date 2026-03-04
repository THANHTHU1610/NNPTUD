var express = require("express");
var router = express.Router();
let { dataRoles, dataUsers } = require("../utils/data");
let { genID } = require("../utils/idHandler");

// GET all
router.get("/", function (req, res) {
  res.send(dataRoles.filter((e) => !e.isDeleted));
});

// GET users in role (YÊU CẦU ĐỀ BÀI)
router.get("/:id/users", function (req, res) {
  let role = dataRoles.find((e) => e.id == req.params.id && !e.isDeleted);
  if (!role) return res.status(404).send({ message: "ROLE NOT FOUND" });

  let users = dataUsers.filter(
    (e) => e.role.id == req.params.id && !e.isDeleted,
  );

  res.send(users);
});

// POST
router.post("/", function (req, res) {
  let newRole = {
    id: genID(dataRoles),
    name: req.body.name,
    creationAt: new Date(),
    updatedAt: new Date(),
  };

  dataRoles.push(newRole);
  res.send(newRole);
});

module.exports = router;
