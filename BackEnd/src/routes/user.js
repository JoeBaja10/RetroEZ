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

const User = mongoose.model('UserAcct_Collection', userSchema);

router.get('/', (req, res) => {
    User.find((err, userGroup) => {
        let userMap = {};

        userGroup.forEach((group) => {
            userMap[group._id] = group;
        });
        
        if (err) return console.error(err);
        res.send(userGroup);
    });
});

router.get('/get/:username/', (req, res) => {
    User.find((err, user) => {

        let acct = "";

        console.log(user);
        console.log(req.params.password);

        user.forEach((u) => {
            console.log(u.password);
            if (u.username == req.params.username) {
                acct = u;
                res.send(acct);
            }
        });

        if (err) return console.error(err);
        res.send(acct);
    });
});

router.get('/:username/:password', (req, res) => {
    User.find((err, user) => {

        let acct = "";

        console.log(user);
        console.log(req.params.password);

        user.forEach((u) => {

            if (u.username == req.params.username) {

                let hash = u.password;

                bcrypt.compare(req.params.password, hash, function(err, res) {
                    if (res) {
                        acct = u;
                    } else {
                        res.send(acct);
                    }
                });

            }
        });


        if (err) return console.error(err);
        res.send(acct);
    });
});

router.post('/', (req, res) => {
    let user = new User();

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            user = new User({
                username: req.body.username,
                password: hash,
            });

            console.log(user);

            user.save((err, user) => {
                if (err) return console.error(err);
                console.log(req.body.password + ' stored');
            });

        });
    });

    res.send(user);
});

module.exports = router;
