const express = require('express');

const router = express.Router();

const igdb = require('igdb-api-node').default;

router.get('/:game', async (req, res) => {
    console.log(req.params.game);

    let gamesToSearch = req.params.game;

    try {
        const response = await igdb('87a4c2d1073c6862032e2e3eb9dc3b11')
            .fields('id,name,cover.url,platforms.name,category')

            .limit(50)

            .search(gamesToSearch)

            // .where(`category == ${0}`)

            .request('/games');

        res.send(response.data);

    }
    catch{
        res.send('ERR!');
    }

});

router.get('/game/:id', async (req, res) => {
    console.log(req.params.id);

    let gameToSearch = req.params.id;

    try {
        const response = await igdb('87a4c2d1073c6862032e2e3eb9dc3b11')
            .fields('id,name,cover.url,age_ratings.rating_cover_url,release_dates.date,franchise.name,genres.name,platforms.name,screenshots.url,summary')

            .limit(50)

            .where('id = ' + gameToSearch)

            .request('/games');

        res.send(response.data);

    }
    catch{
        res.send('ERR!');
    }

});

router.get('/ageRating/:arID', async (req, res) => {

    let arID = req.params.arID;

    try {
        const response = await igdb('87a4c2d1073c6862032e2e3eb9dc3b11')
            .fields('rating_cover_url,rating')

            .where('id = ' + arID)

            .request('/age_ratings');

        console.log(response.data);
        res.send(response.data);
    }
    catch{
        res.send('ERR!');
    };
});

module.exports = router;