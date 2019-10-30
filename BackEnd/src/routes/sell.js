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
    coverURL: String,
    gameID: String,
    title: String,
    price: String,
    desc: String,
    sellingUser: String,
    buyingUser: String,
    deliveryOption: String,
    isBought: Boolean,
});

const Sell = mongoose.model('Sell_Collection', sellSchema);

router.get('/:gameID', (req, res) => {
    Sell.find((err, items) => {
        let itemsForSale = new Array;

        items.forEach((item) => {
            if(req.params.gameID == item.gameID) {
                itemsForSale.push(item);
            }
        });

        res.send(itemsForSale)
    });
});

router.post('/', (req, res) => {
    let gameToSell = new Sell({
        coverURL: req.body.cURL,
        gameID: req.body.gameID,
        title: req.body.title,
        price: req.body.price,
        desc: req.body.desc,
        sellingUser: req.body.sUser,
        buyingUser: null,
        deliveryOption: req.body.dOption,
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