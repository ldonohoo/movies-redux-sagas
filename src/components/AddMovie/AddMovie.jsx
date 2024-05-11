import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';

function AddMovie() {

    const genres = useSelector(store => store.genres);
    const currentGenres = useSelector(store => store.currentGenres)
    let [inputTitle, setInputTitle] = useState('');
    let [inputDescription, setInputDescription] = useState('');
    let [inputFile, setInputFile] = useState(NULL);
    let [inputGenre, setInputGenre] = useState('');
    let [newGenreList, setNewGenreList] = useState(currentGenres);

    const history = useHistory();

    const handleAddMovie = (e) => {
        e.preventDefault();
        // must make a new FormData object to send the file data in
        const formData = new FormData();
        // move the current value of inputFile into fileData
        const fileData = inputFile;
        // add the file, title and description to formData to prepare to send
        formData.append('file', fileData);
        formData.append('title', inputTitle);
        formData.append('description', inputDescription);
        formData.append('genres', newGenreList);
        // post the formData with axios
        //    -need a Content type header to indicate multipart form data
        dispatch({
            type: 'ADD_MOVIE',
            payload: formData
        })
        history.push('/');


        // move to store.js...
        axios({
            method: 'POST',
            url: `http://localhost:5001/api/gallery`,
            data: formData, 
            headers: {'Content-Type': 'multipart/form-data'}
          })
            .then(response => {
              console.log('Item uploaded successfully');
              console.log('Url of filename saved: ', response.data.filename);
              // Clear the form fields and file after successful submission
              setInputTitle('');
              setInputDescription('');
              setInputFile(); 
              // close the modal (function defined in the modal component:
              //                    AddGalleryItemModal                    )
              closeModalAndFetch();
            })
            .catch(error => { 
              console.log('Item upload failed!', error);
            });
      }
  
       /**
       * Component render return (what the component AddItemForm renders)
       */
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
                         onChange={(e) => {setInputFile(e.target.files[0])}}/>
                    {/* go through list of available genres */}
                    <Select>{genres.map(genre => {
                      return (
                        <MenuItem>{genre.name}</MenuItem>
                      )
                    })}
           
                    </Select>
                  <Button type="submit"
                          variant='contained'>Add Item</Button>
              </form>
              <p id="add-form-genres">{newGenreList.map(newGenre => {
                    // display list of current selected genres
                    return ( 
                        <span>{newGenre.name}</span>
                    )})}
              </p>
          </>
      )
  }
  





}

export default AddMovie;