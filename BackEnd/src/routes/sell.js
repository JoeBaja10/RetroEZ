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
    platform: String,
    desc: String,
    sellingUser: String,
    buyingUser: String,
    deliveryOption: String,
    isBought: Boolean,
});

const Sell = mongoose.model('Sell_Collection', sellSchema);

router.get('/', (req, res) => {
    Sell.find((err, items) => {
        console.log(items);
        if (err) return console.error(err);
        res.send(items);
    });
});

router.get('/get/:id', (req, res) => {
    Sell.findById(req.params.id, (err, item) => {
        res.send(item);
    });
});

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
        platform: req.body.platform,
        desc: req.body.desc,
        sellingUser: req.body.sUser,
        buyingUser: null,
        dateSold: null,
        deliveryOption: req.body.dOption,
        isBought: false
    });

    console.log(gameToSell);

    gameToSell.save((err, gameToSell) => {
        if (err) return console.error(err);
        console.log(req.body.title + ' stored');
    });
});

router.put('/:id', (req, res) => {
    Sell.findById(req.params.id, (err, item) => {
        let date = new Date();
        if (err) return console.error(err);
        item.buyingUser = req.body.bUser;
        item.dateSold = date.getDate();
        item.isBought = true;
        item.save((err, item) => {
            if (err) return console.error(err);
        })
    });
});

router.delete('/:id', (req, res) => {
    Sell.findByIdAndRemove(req.params.id, (err, sell) => {
        if (err) return console.error(err);
    });

    res.send('Deleted!')
});

module.exports = router;