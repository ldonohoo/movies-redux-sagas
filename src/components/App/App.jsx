import './App.css';
import { HashRouter as Router, Route } from 'react-router-dom';
import MovieList from '../MovieList/MovieList';
import MoviesDetail from '../MoviesDetail/MoviesDetail';
import AddEditMovie from '../AddEditMovie/AddEditMovie';


function App() {
  return (
    <div className="App">
      <h1>The Movies Saga!</h1>
        <Route path="/" exact>
          <MovieList />
        </Route>
        <Route path="/detail/:id">
          <MoviesDetail />
        </Route>
        <Route path="/add_edit/:id">
          <AddEditMovie />
        </Route>
    </div>
  )
}

export default App;
