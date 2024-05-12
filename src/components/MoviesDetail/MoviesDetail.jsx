import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";


function MoviesDetail() {

    const history = useHistory()
    const dispatch = useDispatch();
    const movieDetails = useSelector(store => store.currentMovieDetails);
    const currentGenres = useSelector(store => store.currentGenres);
    const { id } = useParams();
    console.log(id);
    const currentMovie = id;

    useEffect(() => {
        console.log('current Movie:', currentMovie);
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
            type: 'GET_GENRES_FOR_MOVIE',
            payload: currentMovie
        })
    }

    const backToMovieList = () => {
        console.log('back to movie list view!')
        history.push('/');
    }

    return (
        <>
        <div data-testid="movieDetails">
            <h3>{movieDetails.title}</h3>
            <figure>
                <img src={movieDetails.poster}/>
                <figcaption>{movieDetails.description}</figcaption>
            </figure>
            {currentGenres.map(genre => {
                return (
                    <p key={genre.id}>{genre.name}</p>
                )
            })}
        </div>
        <button data-testid="toList"
                onClick={backToMovieList}>back to movie list</button>
        </>
    )
}

export default MoviesDetail;