let dataRoles = [
  {
    id: 1,
    name: "Customer",
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 2,
    name: "Admin",
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
];

let dataUsers = [
  {
    id: 1,
    email: "customer@example.com",
    password: "123456",
    name: "Customer User",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: dataRoles[0],
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 2,
    email: "admin@example.com",
    password: "123456",
    name: "Admin User",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: dataRoles[1],
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
];

module.exports = {
  dataRoles: dataRoles,
  dataUsers: dataUsers
};
