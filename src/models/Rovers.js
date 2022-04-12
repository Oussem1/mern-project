const mongoose = require('mongoose');

const RoverSchema = new mongoose.Schema({
    name: String,
    launch_date : String,
    construction_date: String,
    constructor: String,
    image: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Rover', RoverSchema);