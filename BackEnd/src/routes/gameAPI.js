const express = require('express');

const router = express.Router();

const igdb = require('igdb-api-node').default;

router.get('/:game', async (req, res) => {
    console.log(req.params.game);

    try {
        const response = await igdb('87a4c2d1073c6862032e2e3eb9dc3b11')
            .fields('name,age_ratings,cover,dlcs,expansions,first_release_date,franchise,genres,screenshots,status,standalone_expansions,summary,videos,websites')

            .limit(50)
            .offset(10)

            .sort('name')
            .search(req.params.game)

            .request('/games');

        res.send(response.data);
    }
    catch {
        res.send('Error getting game data');
    }

});

module.exports = router;