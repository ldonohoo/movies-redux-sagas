import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, Select, MenuItem } from '@mui/material';

function AddMovie() {

    // const currentGenres = useSelector(store => store.currentGenres)
    let [inputTitle, setInputTitle] = useState('');
    let [inputDescription, setInputDescription] = useState('');
    let [inputPosterFile, setInputPosterFile] = useState();
    let [selectedGenre, setSelectedGenre] = useState('');

    // new genres to save to movie
    let [newGenres, setNewGenres] = useState([]);
    const genres = useSelector(store => store.genres);

    const history = useHistory();

    useEffect(() => {
      fetchGenres()
    }, []);

    const dispatch = useDispatch();


    const fetchGenres = () => {
      dispatch({ type: 'FETCH_GENRES' })
    }

    const handleAddMovie = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(newGenres))
        dispatch({
            type: 'ADD_MOVIE',
            payload: { file: inputPosterFile, 
                       title: inputTitle,
                       description: inputDescription,
                       genres: [1, 2, 3] }
        })
        history.push('/');
    }
  
       /**
       * Component render return (what the component AddItemForm renders)
        */
      const handleGenreSelect = (event) => {
        // save genre selected with dropdown
        const genreToAdd = event.target.value;
        // add selected option to current selected genres
        const genreReset = [...newGenres, genreToAdd];
        setNewGenres(genreReset);
      }

      const handleGenreRemove = (genreId) => {
        let filteredGenresArray = [];
        filteredGenresArray = newGenres.filter(g => g !== genreId);
        setNewGenres(filteredGenresArray);
      }

      return (
          <>
              <h2>Add a Movie</h2>
              <form onSubmit={(e) => {handleAddMovie(e)}} 
                    encType="multipart/form-data">
                  <TextField id="item-title" 
                         label="Title"
                         type="text"
                         value={inputTitle}
                         onChange={(e) => setInputTitle(e.target.value)}
                         required/>
                  <TextField id="item-description" 
                         label="Description" 
                         type="text"
                         value={inputDescription}
                         onChange={(e) => setInputDescription(e.target.value)}
                         required/>
                  <label htmlFor='file-upload'></label>
                  <input id="file-upload"
                         type="file"
                         onChange={(e) => {setInputPosterFile(e.target.files[0])}}/>
                    {/* go through list of available genres */}
                  {inputPosterFile ? <img src={inputPosterFile}/> : ''}                    
                    <Select value={selectedGenre}
                            onChange={handleGenreSelect}
                            >{genres.map((genre) => {
                      return (
                        <MenuItem key={genre.id}
                                  value={genre.id}
                                  disabled={ newGenres.includes(genre.id) ? true : false } 
                          >{genre.name}</MenuItem>
                      )
                    })}
                    </Select>
                  <Button type="submit"
                          variant='contained'>Add Item</Button>
              </form>
              <h4 id="add-form-genres">{newGenres.map(newGenre => {
                    // display list of current selected genres
                    const matchingGenre = genres.find(g => g.id === newGenre);
                    return ( 
                      <p key={matchingGenre.id}>{matchingGenre.name}
                        <span>
                          <button onClick={() => {handleGenreRemove(matchingGenre.id)}}>| X</button>
                        </span>
                      </p>
                    )
                  })}
              </h4>

          </>
      )
  }

export default AddMovie;