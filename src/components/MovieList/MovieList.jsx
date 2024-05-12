import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MovieList.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, TextField, Select, MenuItem } from '@mui/material';


function MovieList() {

  const history = useHistory();
  const dispatch = useDispatch();
  const movies = useSelector(store => store.movies);

  const [inputSearch, setInputSearch] = useState('');
  // sort options:
  //       -first_added is by id acending
  //       -last_added is by id decending
  //       -title_ascending 
  //       -title_descending 
  const [selectedSort, setSelectedSort] = useState('title_ascending');

  useEffect(() => {
    dispatch({ type: 'FETCH_MOVIES' })
  }, []);

const handleClickMovie = (movieId) => {
  dispatch({
    type: 'SET_CURRENT_MOVIE',
    payload: {id: movieId}
  })
  console.log('going to detail!')
  history.push(`/detail/${movieId}`);
}

const handleAddMovie = () => {
  history.push(`/add_edit/add`);
}

const handleSearch = () => {
  dispatch({ 
    type: 'FETCH_SEARCH_SORT_MOVIES', 
    payload: {q: inputSearch, sort: selectedSort}
   });
};

const handleSelectSort = (event) => {
  let sort = event.target.value;
  dispatch({ 
    type: 'FETCH_SEARCH_SORT_MOVIES', 
    payload: {q: inputSearch, sort: sort}
   });
   setSelectedSort(sort);
}

  return (
    <main>
      <h1>MovieList</h1>
      <TextField id="search" 
                 label="Search Title"
                 type="text"
                 value={inputSearch}
                 onChange={(e) => setInputSearch(e.target.value)}>
      </TextField>
      <Button variant='contained'
              onClick={handleSearch}>Search</Button>
      <Button variant='contained'
              onClick={handleAddMovie}>Add Movie</Button>
      <Select labelId="select-category"
              value={selectedSort}
              onChange={handleSelectSort}>
                  return (
                        <MenuItem value="title_ascending">Title ascending</MenuItem>
                        <MenuItem value="title_descending">Title decending</MenuItem>
                        <MenuItem value="first_added">First added</MenuItem>
                        <MenuItem value="last_added">Last added</MenuItem>
                  )
      </Select>
      <section className="movies">
        {movies.map(movie => {
          return (
            <div data-testid='movieItem' key={movie.id}>
              <h3>{movie.title}</h3>
                <img onClick={() => {handleClickMovie(movie.id)}}
                    src={movie.poster} 
                    alt={movie.title}
                    data-testid="toDetails"/>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default MovieList;
