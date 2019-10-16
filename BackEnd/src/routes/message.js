const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

const mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {

});

const messageSchema = mongoose.Schema({
    message: String,
    sendingUser: String,
    recievingUser: String,
    isRead: Boolean,
    isTrashed: Boolean
});

const Message = mongoose.model('Message_Collection', messageSchema);

router.get('/', (req, res) => {
    Message.find((err, messages) => {
        if (err) return console.error(err);
        res.send(messages);
    });
});

router.get('/message/:id', (req, res) => {

});

router.post('/', (req, res) => {
    let message = new Message({
        message: req.body.message,
        sendingUser: req.body.sUser,
        recievingUser: req.body.rUser,
        isRead: false,
        isTrashed: false
    });

    console.log(message);

    message.save((err, message) => {
        if (err) return console.error(err);
        console.log(req.body.message + ' stored');
    });


res.send(message);
});

router.put('/:isRead', (req, res) => {

});

module.exports = router;