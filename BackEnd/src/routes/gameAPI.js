const express = require('express');

const router = express.Router();

const igdb = require('igdb-api-node').default;

router.get('/:game', async (req, res) => {
    console.log(req.params.game);

    let gamesToSearch = req.params.game;

    try {
        const response = await igdb('87a4c2d1073c6862032e2e3eb9dc3b11')
            .fields('id,name,cover,platforms.name,category')

            .limit(50)

            .search(gamesToSearch)

            // .where(`category == ${0}`)

            .request('/games');

        res.send(response.data);

        // fields age_ratings,dlcs,expansions,first_release_date,franchise,genres.name,platforms.name,screenshots,standalone_expansions,summary,videos,websites
    }
    catch{
        res.send('ERR!');
    }

});

router.get('/cover/:coverID', async (req, res) => {

    let coverID = req.params.coverID;

    try {
        const response = await igdb('87a4c2d1073c6862032e2e3eb9dc3b11')
            .fields('url')

            .where('id = ' + coverID)

            .request('/covers');

        console.log(response.data);
        res.send(response.data);
    }
    catch{
        res.send('ERR!');
    };
});

module.exports = router;