const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
// load multer to handle file uploads
const multer  = require('multer');


// This sets up the type of storage used, there are two other options I think?
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // the destination for the file upload is declared below.
    //    the null is some sore of error msg or handling??
    return cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    // the filename is compiled below, it's:
    //   <current date time stamp> + <underscore> + <filename uploaded>
    return cb(null, `${Date.now()}_${file.originalname}`)
 }
});

// declares the upload to go use the defined storage above
const upload = multer({storage: storage});


router.get('/', (req, res) => {
  const query = `
    SELECT * FROM "movies"
      ORDER BY "title" ASC;
  `;
  pool.query(query)
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })
});

router.get('/search_sort/', (req, res) => {
  const search = req.query.q;
  const sort = req.query.sort;
  console.log('search, sort', search, sort);
  let sortString = 'title_ascending';
  switch (sort) {
    case 'title_ascending':
      sortString = 'title ASC';
      break;
    case 'title_descending':
      sortString = 'title DESC';
      break;
    case 'first_added':
      sortString = 'id ASC';
      break;
    case 'last_added':
      sortString = 'id DESC';
      break;
  }
  let searchString = '';
  let queryParams = [];
  if (search) {
    searchString = "WHERE title LIKE $1";
    // Add wildcards to the search string
    queryParams.push(`%${search}%`);
  } 
  const query = `
    SELECT * FROM movies
    ${searchString}
    ORDER BY ${sortString};
  `;
  console.log(query)
  pool.query(query, queryParams)
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })
});


router.get('/:id', (req, res) => {
  const movieId = req.params.id;
  const query=`
    SELECT * FROM movies
      WHERE id = $1;
  `;
  pool.query(query, [movieId])
  .then(dbRes => {
    console.log('GET of single movie details in /api/movies/:id sucessful!');
    res.send(dbRes.rows);
  })
  .catch(dbErr => {
    console.log('GET of single movie details in /api/movies/:id went very poorly:', dbErr);
    res.sendStatus(500);
  })
})

// POST /gallery 
//             - saves poster/file image to images folder
//               (uses Multer to grab image file from part of formData object)
//             - saves movie to the movies table
//             - saves genres for new movie to the movies_genres table
router.post('/', upload.single('file'), (req, res) => {
  console.log('req.body the text fields:', JSON.stringify(req.body));  
  const filename = req.file.filename;
  console.log('filename:', req.file.filename);
  const newMovieTitle = req.body.title;
  const newMovieDescription = req.body.description;
  const newGenres = req.body.genres;
  console.log('newGenres:', newGenres)
  console.log( ' adding new movie: ', filename, newMovieTitle, newMovieDescription, newGenres[0]);
  // add the path to the filename before sending to database
  const filenameUrl = `images/${filename}`;
    console.log('Adding movie: ',newMovieTitle, newMovieDescription, newGenres[0], filename);
  const insertMovieQuery = `
    INSERT INTO "movies" 
      ("title", "poster", "description")
      VALUES
      ($1, $2, $3)
      RETURNING "id";
  `;
  const insertMovieValues = [
    req.body.title,
    filenameUrl,  //this is the poster (image name)
    req.body.description
  ]
  pool.query(insertMovieQuery, insertMovieValues)
    .then(result => {
      console.log('New Movie Id:', result.rows[0].id);
      const createdMovieId = result.rows[0].id
      // add the new genres for new movie into the movies_genres list
      //    unnest- unnests a list so allows n inserts for list length n
      //    ::INTEGER type casts to integer, string_to_array forces string to 
      //        array splitting on delimiter ','
      const insertMovieGenreQuery = `
      INSERT INTO movies_genres 
          (movie_id, genre_id)
        SELECT 
          $1 AS movie_id, 
          unnest(string_to_array($2, ','))::INTEGER AS genre_id;
      `;
        const insertMovieGenreValues = [
          createdMovieId,
          newGenres
        ]
        // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
        pool.query(insertMovieGenreQuery, insertMovieGenreValues)
        .then(result => {
          //Now that both are done, send back success!
          res.sendStatus(201);
        }).catch(err => {
          // catch for second query
          console.log(err);
          res.sendStatus(500)
      })
    }).catch(err => { // 👈 Catch for first query
      console.log(err);
      res.sendStatus(500)
    })
})

router.put('/', upload.single('file'), (req, res) => {
  console.log('req.body the text fields:', JSON.stringify(req.body));  
  const hasFilename = req.body.filechanged === 'false' ? false : true;
  console.log('filechanged', hasFilename);

  if (hasFilename) {
    console.log('here')
    const filename = req.file.filename;
    console.log('filename:', req.file.filename);
    const filenameUrl = `images/${filename}`;
  }
  const newMovieTitle = req.body.title;
  const newMovieDescription = req.body.description;
  const newGenres = req.body.genres;
  const movieId = req.body.id;
  console.log('newGenres:', newGenres)
  console.log( ' adding new movie: ', newMovieTitle, newMovieDescription, newGenres[0]);
  // add the path to the filename before sending to database
  console.log('Updating movie: ',newMovieTitle, newMovieDescription, newGenres[0]);
  let fileString = hasFilename ? 'poster = $2,' : '';
  const insertMovieQuery = `
    UPDATE movies 
      SET title = $1,
          ${fileString}
          description = $3
      WHERE id = $4;
  `;
  const insertMovieValues = [
    req.body.title,
    fileString, 
    req.body.description,
    movieId
  ]
  pool.query(insertMovieQuery, insertMovieValues)
    .then(result => {
      // SECOND QUERY to delete all items in the movies_genres table 
      //    as we are doing a full replace of the movies_genres items
      const deleteMovieGenreQuery = `
      DELETE movies_genres
      WHERE movie_id = $1;
      `;
      pool.query(deleteMovieGenreQuery, [movieId])
      .then(deleteResult => {
        const insertMovieGenreQuery = `
        INSERT INTO movies_genres 
            (movie_id, genre_id)
          SELECT 
            $1 AS movie_id, 
            unnest(string_to_array($2, ','))::INTEGER AS genre_id;
        `;
          const insertMovieGenreValues = [
            movieId,
            newGenres
          ]
          // THIRD QUERY ADDS GENRE FOR THAT NEW MOVIE
          pool.query(insertMovieGenreQuery, insertMovieGenreValues)
          .then(result => {
            //Now that both are done, send back success!
            res.sendStatus(201);
          }).catch(err => {
            // catch for third query
            console.log('Error in insert of genres', err);
            res.sendStatus(500)
        })
      }).catch(err => { 
        // catch for second query
        console.log('Error in delete of genres', err);
        res.sendStatus(500)
     })
    }).catch(err => { 
      // catch for first query
      console.log('Error in update of movies', err);
      res.sendStatus(500)
    })
})




//---------ROUTES!----------------------------------------------------------

// // POST /gallery --NOW with Multer!!! Yay!!!
// router.post('/', upload.single('file'), (req, res) => {
//   // The data comes up in two parts:
//   //    req.body contains the two text fields saved
//   //       in 'title' & 'description'
//   //    req.file contains the FormData object which is the actual file
//   //       it was stored in 'file'
//   //  below is view of whole body and file objects
//   console.log('req.body the text fields:', req.body);  
//   console.log('req.file the file object:', req.file);  
//   // This is how you pull the filename, it comes through as req.file.filename
//   console.log('filename:', req.file.filename);
//   // set all three fields to send to the database
//   const filename = req.file.filename;
//   const newFileTitle = req.body.title;
//   const newFileDescription = req.body.description;
//   // add the path to the filename before sending to database
//   const filenameUrl = `images/${filename}`;
//     console.log('Adding gallery item: ',
//         newFileTitle, newFileDescription, filename);
//     sqlText = `
//         INSERT INTO gallery
//           (title, description, url)
//           VALUES ($1, $2, $3);
//     `;
//     pool.query(sqlText, [newFileTitle,
//                          newFileDescription, 
//                          filenameUrl])
//     .then(dbRes => {
//       console.log('POST in api/gallery completed succussfully!');
//       // on a successful POST send back the new filename you just created 
//       //     why?  I don't know for fun.  at first I thought I needed this info
//       res.send({filenameUrl: filenameUrl});
//     })
//     .catch(dbErr=> {
//       console.log('POST in api/gallery failed miserably:', dbErr);
//       res.sendStatus(500);
//     })
//   });



module.exports = router;
