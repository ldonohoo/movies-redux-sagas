import React, { useState, useEffect } from 'react';
import { useHistory} from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function AddMovie() {

    let mode = null;
    const { id } = useParams();
    const currentMovie = id;
    if (currentMovie === 'add') {
      mode = 'add';
    } else {
      mode = 'edit';
    }
    console.log(`In ${mode} mode!`);

    useEffect(() => {
      fetchGenres()
    }, []);

    // state variables for edit mode
    const movieDetails = useSelector(store => store.currentMovieDetails);
    const currentGenres = useSelector(store => store.currentGenres);

    // genres for movie to add/edit
    // let [newGenres, setNewGenres] = useState(currentGenres || []);
    const genres = useSelector(store => store.genres);

    const getMovieDetails = () => {
      console.log('getting dtails..adf')
      dispatch({
          type: 'GET_MOVIE_DETAILS',
          payload: currentMovie
      })
    }

    const getCurrentGenres = () => {
        dispatch({
            type: 'GET_GENRES_FOR_MOVIE',
            payload: currentMovie
        })
    }

    if (mode === 'edit') {
      useEffect(() => {
        getMovieDetails();
        getCurrentGenres();
      },[])
    }

    // const currentGenres = useSelector(store => store.currentGenres)
    let [inputTitle, setInputTitle] = useState(movieDetails.title || '');
    let [inputDescription, setInputDescription] = useState(movieDetails.description || '');
    let [inputPosterFile, setInputPosterFile] = useState(movieDetails.poster || '');
    let [selectedGenre, setSelectedGenre] = useState('');

    const history = useHistory();
    const dispatch = useDispatch();

    const fetchGenres = () => {
      dispatch({ type: 'FETCH_GENRES' })
    }

    const handleAddSaveMovie = (e) => {
        e.preventDefault();
        // console.log(JSON.stringify(newGenres))
        if (mode === 'add') {
          dispatch({
              type: 'ADD_MOVIE',
              payload: { file: inputPosterFile, 
                        title: inputTitle,
                        description: inputDescription,
                        genres: currentGenres }
          })
        } else {
          dispatch({
            type: 'UPDATE_MOVIE',
            payload: { file: inputPosterFile, 
                       title: inputTitle,
                       description: inputDescription,
                       genres: currentGenres }
          })
        }
        history.push('/');
    }
  
       /**
       * Component render return (what the component AddItemForm renders)
        */
      const handleGenreSelect = (event) => {
        const { id, name } = event.target.value;
        console.log('bob', id, name)
        // save genre selected with dropdown
        const genreToAdd = {id, name};
        // add selected option to current selected genres
        const genreReset = [...currentGenres, genreToAdd];
        console.log(genreReset);
        dispatch({
          type: 'SET_CURRENT_GENRES',
          payload: genreReset
        });
      }

      const handleGenreRemove = (genreId) => {
        console.log(genreId)
        let filteredGenresArray = [];
        filteredGenresArray = currentGenres.filter(g => g.id !== genreId);
        console.log(filteredGenresArray);
        dispatch({
          type: 'SET_CURRENT_GENRES',
          payload: filteredGenresArray
        });
      }

      const handleCancel = () => {
        history.push('/');
      }

      return (
          <>
              <h2>Add a Movie</h2>
              <form onSubmit={(e) => {handleAddSaveMovie(e)}} 
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
                            const isGenreSelected = currentGenres.some(currGenre => currGenre.id === genre.id);
                      return (
                        <MenuItem key={genre.id}
                                  value={{id: genre.id, name: genre.name}}
                                  disabled={ isGenreSelected ? true : false } 
                          >{genre.name}</MenuItem>
                      )
                    })}
                    </Select>
                  <Button type="submit"
                          variant='contained'>{mode === 'add' ? 'Add' : 'Save'}</Button>
                  <Button type="button"
                          variant='contained'
                          onClick={handleCancel}>Cancel
                  </Button>
              </form>
              <h4 id="add-form-genres">{currentGenres.map(currGenre => {
                    // display list of current selected genres
                    return ( 
                      <p >
                        <span key={currGenre.id}>{currGenre.name}
                          <button onClick={() => {handleGenreRemove(currGenre.id)}}>| X</button>
                        </span>
                      </p>
                    )
                  })}
              </h4>

          </>
      )
  }

export default AddMovie;