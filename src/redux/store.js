import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

// Create the rootSaga generator function
function* rootSaga() {
  yield takeEvery('FETCH_MOVIES', fetchAllMovies);
  yield takeEvery('GET_MOVIE_DETAILS', getMovieDetails);
  yield takeEvery('GET_GENRES_FOR_MOVIE', getGenresForMovie)
}

function* fetchAllMovies() {
  try {
    // Get the movies:
    const moviesResponse = yield axios.get('/api/movies');
    // Set the value of the movies reducer:
    yield put({
      type: 'SET_MOVIES',
      payload: moviesResponse.data
    });
  } catch (error) {
    console.log('fetchAllMovies error:', error);
  }
}

function* getMovieDetails(action) {
  console.log('Getting Movie Details for movie numnber', action.payload);
  try {
    const response = yield axios({
      method: 'GET',
      url: `/api/movies/${action.payload}`
    })
    console.log('current movie details: ', response.data);
    yield put({
      type: 'SET_CURRENT_MOVIE_DETAILS',
      payload: response.data
    })
  }
  catch(error) {
    console.log('Error in get of movie details:', error);
  }
}

function* getGenresForMovie(action) {
  const movieId = action.payload;
  try {
    const response = yield axios({
      method: 'GET',
      url: `/api/genres/${movieId}`
    })
    yield put({
      type: 'SET_CURRENT_GENRES',
      payload: response.data
    })
  }
  catch(error) {
    console.log('Get of genres for one movie failed:', error);
  }
}


// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server
const movies = (state=[], action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      return action.payload;
    default:
      return state;
  }
}

// Used to store the movie genres
const genres = (state=[], action) => {
  switch (action.type) {
    case 'SET_GENRES':
      return action.payload;
    default:
      return state;
  }
}

const currentMovie = (state='', action) => {
  if (action.type === 'SET_CURRENT_MOVIE') {
    return action.payload.id;
  }
  return state;
}

const currentGenres = (state=[], action) => {
  if (action.type === 'SET_CURRENT_GENRES') {
    return action.payload;
  }
  return state;
}

const currentMovieDetails = (state={}, action) => {
  if (action.type === 'SET_CURRENT_MOVIE_DETAILS') {
    return action.payload[0];
  }
  return state;
}

// Create one store that all components can use
const store = createStore(
  combineReducers({
    movies,
    genres,
    currentMovie,
    currentMovieDetails,
    currentGenres
  }),
  // Add sagaMiddleware to our store
  applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

export default store;
