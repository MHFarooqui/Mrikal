const mongoose = require('mongoose');
const { Schema } = mongoose;

const Document = new Schema({
    content: {
        type: String
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Document', Document)