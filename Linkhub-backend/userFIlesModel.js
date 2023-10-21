const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const userFiles = mongoose.model('User', userSchema);
module.exports = userFiles;