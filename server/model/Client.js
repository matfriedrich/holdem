const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Client = new Schema({
    id: ObjectId,
    username: String,
    ip: String
});

exports = Client;
