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

router.get('/:id', (req, res) => {
    Message.findById(req.params.id, (err, message) => {
        if (err) return console.error(err);
        res.send(message);
    });
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

router.put('/', (req, res) => {
    Message.findById(req.body.id, (err, message) => {
        if (err) return console.error(err);
        message.message = req.body.message;
        message.sendingUser = req.body.sUser;
        message.recievingUser = req.body.rUser;
        message.isRead = false;
        message.isTrashed = true;
        message.save((err, message) => {
            res.send(req.body.message + ' trashed');
        });
    });
});

module.exports = router;