const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    pseudo : String,
    password: String,
    isAdmin: Boolean
})

module.exports = mongoose.model('User', UserSchema);