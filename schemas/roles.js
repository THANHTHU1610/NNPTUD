let mongoose = require('mongoose');
let rolesSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "ten khong duoc rong"],
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
})
module.exports = new mongoose.model('role', rolesSchema)