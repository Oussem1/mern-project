const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    country: String,
    start_date : String,
    end_date: String,
    rovers: String
})

module.exports = mongoose.model('Mission', MissionSchema);