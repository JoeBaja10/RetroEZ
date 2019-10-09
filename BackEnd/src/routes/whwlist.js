const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

const mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {

});

const listSchema = mongoose.Schema({
    userid: String,
    want: Array,
    have: Array,
    wish: Array
});

const List = mongoose.model('List_Collection', listSchema);

router.get('/', (req, res) => {
    List.find((err, listGroup) => {
        let listMap = {};

        listGroup.forEach((group) => {
            listMap[group._id] = group;
        });
        
        if (err) return console.error(err);
        res.send(listGroup);
    });
});

router.post('/', (req, res) => {
    const list = new List({
        userid: req.body.userid,
        want: [],
        have: [],
        wish: [],
    });

    list.save((err, list) => {
        if (err) return console.error(err);
        console.log(list + ' has been stored');
    });

    res.send(list);
});

module.exports = router;