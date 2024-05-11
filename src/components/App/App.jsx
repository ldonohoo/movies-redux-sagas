import './App.css';
import { HashRouter as Router, Route } from 'react-router-dom';
import MovieList from '../MovieList/MovieList';
import MoviesDetail from '../MoviesDetail/MoviesDetail';


function App() {
  return (
    <div className="App">
      <h1>The Movies Saga!</h1>
        <Route path="/" exact>
          <MovieList />
        </Route>
        <Route path="/detail">
          <MoviesDetail />
        </Route>
    </div>
  )
}

export default App;