const mongoose = require('mongoose');

const daysSchema = new mongoose.Schema({
   day: String,
   date: {
        type: Date,
        default: Date.now
    },
    mood: String,
    text: String,
    title: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

const Day = mongoose.model('Day', daysSchema);

module.exports = Day;