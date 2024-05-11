const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {
    sqlText = `
      SELECT * FROM genres`;
    pool.query(sqlText)
    .then(dbRes => {
      console.log('Get of genres sucessful in /api/genres');
      res.send(dbRes.rows);
    })
    .catch(dbErr => {
      console.log('Get of genres failed in /api/genres', dbErr);
      res.sendStatus(500);
    });
});  


router.get('/:id', (req, res) => {
  const movieId = req.params.id;
  sqlText = `
    SELECT * FROM genres
      INNER JOIN movies_genres
      ON genres.id = movies_genres.genre_id
      WHERE movies_generes.movie_id = $1;
  `;
  pool.query(sqlText, [movieId])
  .then(dbRes => {
    console.log('Get of genres for one movie sucessful!');
    res.send(dbRes.rows);
  })
  .catch(dbErr => {
    console.log('Get of genres for one movie failed:', dbErr);
    res.send(500);
  })
});


module.exports = router;