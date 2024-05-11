import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function MoviesDetail() {

    const history = useHistory();
    const [movieDetails, setMovieDetails] = useState();
    const currentMovie = useSelector(store => store.currentMovie);
    const currentGenres = useSelector(store => store.currentGenre);

    useEffect(() => {
        getMovieDetails();
        getGenres();
    }, []);

    const getMovieDetails = () => {
        console.log('getting dtails..adf')
        dispatch({
            type: 'GET_MOVIE_DETAILS',
            payload: currentMovie
        })
    }

    const getGenres = () => {
        dispatch({
            type: 'GET_GENRES_FOR_MOVIE'
        })
    }

    return (
        <>
        <p>{JSON.stringify(currentMovie)}</p>
        <div data-testid="movieDetails">
            <h3>{currentMovie.title}</h3>
            <figure>
                <img src={currentMovie.poster}/>
                <figcaption>{currentMovie.detail}</figcaption>
            </figure>
            {currentGenres.map(genre => {
                return (
                    <p key={genre.id}>{genre.name}</p>
                )
            })}
        </div>
        <button data-testid="toList"
                onSubmit={history.push('/')}>back to movie list</button>
        </>
    )
}

export default MoviesDetail;