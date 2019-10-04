const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

const mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {

});

const userSchema = mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User_Collection', userSchema);

router.get('/get/:username/', (req, res) => {
    User.find((err, user) => {

        console.log(user);
        console.log(req.params.password);

        user.forEach((u) => {
            console.log(u.password);
            if (u.username == req.params.username) {
                res.send(true);
            }
        });

        if (err) return console.error(err);
        res.send(false);
    });
});

router.get('/:username/:password', (req, res) => {
    User.find((err, user) => {

        console.log(user);
        console.log(req.params.password);

        user.forEach((u) => {

            if (u.username == req.params.username) {

                bcrypt.compare(req.params.password, hash, function (err, res) {
                    if (res) {
                        res.send(true);
                    } else {
                        res.send(false);
                    }
                });

            }
        });


        if (err) return console.error(err);
        res.send(false);
    });
});

router.post('/', (req, res) => {
    const user = new User();

    bcrypt.hash(req.body.password, 10, function(err, hash) {
        user = new User({
            username: req.body.username,
            password: hash,
        }); 
    });

    console.log(user);

    user.save((err, user) => {
        if (err) return console.error(err);
        console.log(req.body.username + ' stored');
    });

    res.send(user);
});

module.exports = router;
