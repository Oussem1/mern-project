const mongoose = require('mongoose');

const RoverSchema = new mongoose.Schema({
    name: String,
    launch_date : String,
    construction_date: String,
    constructor: String,
    image: String
})

module.exports = mongoose.model('Rover', RoverSchema);