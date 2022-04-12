const mongoose = require('mongoose');

const RoverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    launch_date : {
        type: String,
        required: false
    },
    construction_date: {
        type: String,
        required: false
    },
    constructor_rover: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('Rover', RoverSchema);