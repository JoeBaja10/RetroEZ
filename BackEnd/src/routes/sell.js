const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

const mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', (callback) => {

});

const sellSchema = mongoose.Schema({
    gameID: String,
    title: String,
    price: String,
    sellingUser: String,
    buyingUser: String,
    isBought: Boolean,
});

const Sell = mongoose.model('Sell_Collection', sellSchema);

router.get('/:id', (req, res) => {

});

router.post('/', (req, res) => {
    let gameToSell = new Sell({
        gameID: req.body.gameID,
        title: req.body.title,
        sellingUser: req.body.sUser,
        buyingUser: 'none',
        isBought: false
    });

    console.log(gameToSell);

    gameToSell.save((err, gameToSell) => {
        if (err) return console.error(err);
        console.log(req.body.title + ' stored');
    });
});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;