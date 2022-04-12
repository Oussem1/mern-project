const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    mission_name : {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    rovers: {
        type: Array,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Mission', MissionSchema);