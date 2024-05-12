import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MovieList.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function MovieList() {

  const history = useHistory();
  const dispatch = useDispatch();
  const movies = useSelector(store => store.movies);

  useEffect(() => {
    dispatch({ type: 'FETCH_MOVIES' });
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
  history.push('/add');
}

  return (
    <main>
      <h1>MovieList</h1>
      <button onClick={handleAddMovie}>Add Movie</button>
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
