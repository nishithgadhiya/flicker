import React, { useEffect, useState } from 'react'
import axios from 'axios'
//styling
import styled from 'styled-components'
//components for Autocomplete
import Suggestion from './Suggestion'
import Images from './Images'
//variables
let page = 1
let userQuery = ['1']

//main component
const Gallery = () => {
  //state declaration
  const [images, setImages] = useState([])
  const [flag, setFlag] = useState(false)
  const [searchField, setSearchField] = useState('')
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([])
  const [selectedSuggestion, setSelectedSuggestion] = React.useState(0)
  const [displaySuggestions, setDisplaySuggestions] = React.useState(false)
  //variables
  let moreData = []

  //accessing localstorage
  localStorage.setItem('userQuery', JSON.stringify(userQuery))
  const suggestions = JSON.parse(localStorage.getItem('userQuery'))

  //when page loads it shows getRecent photos
  useEffect(() => {
    async function fetchImageData() {
      await axios
        .get(
          `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${process.env.REACT_APP_FLIKER_API}&per_page=16&page=1&format=json&nojsoncallback=true`,
        )
        .then((response) => {
          setImages(response.data.photos.photo)
          setFlag(true)
        })
        .catch((error) => {
          console.log('Error fetching and parsing data', error)
        })
    }
    fetchImageData()
  }, [])

  //when user typing, it fetches result as per input
  useEffect(() => {
    setImages([])
    console.log(searchField)
    async function fetchSearchImageData(query) {
      await axios
        .get(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLIKER_API}&tags=${query}&per_page=16&page=1&format=json&nojsoncallback=true`,
        )
        .then((response) => {
          setFlag(true)
          page = 1
          setImages(response.data.photos.photo)
        })
        .catch((error) => {
          console.log('Error fetching and parsing data', error)
        })
    }
    fetchSearchImageData(searchField)
  }, [searchField])

  //to fetch more search results
  const loadMore = async () => {
    page++
    if (searchField) {
      await axios
        .get(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLIKER_API}&tags=${searchField}&per_page=16&page=${page}&format=json&nojsoncallback=true`,
        )
        .then((response) => {
          console.log(page)
          setImages([...images, ...response.data.photos.photo])
        })
        .catch((error) => {
          console.log('Error fetching and parsing data', error)
        })
    } else {
      await axios
        .get(
          `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${process.env.REACT_APP_FLIKER_API}&per_page=16&page=${page}&format=json&nojsoncallback=true`,
        )
        .then((response) => {
          console.log(page)
          setImages([...images, ...response.data.photos.photo])
        })
        .catch((error) => {
          console.log('Error fetching and parsing data', error)
        })
    }
  }

  const handleSearch = (e) => {
    setSearchField(e.target.value)
    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(e.target.value.toLowerCase()),
    )

    setFilteredSuggestions(filteredSuggestions)
    setDisplaySuggestions(true)
  }

  const onSelectSuggestion = (index) => {
    setSelectedSuggestion(index)
    setSearchField(filteredSuggestions[index])
    setFilteredSuggestions([])
    setDisplaySuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(typeof searchField)
    let temp = JSON.parse(localStorage.getItem('userQuery'))
    if (temp.indexOf(searchField) === -1) {
      userQuery.push(searchField)
      localStorage.setItem('userQuery', JSON.stringify(userQuery))
    }
  }

  return (
    <div className="gallery-main">
      <Header>
        <h3>
          <a id="logo" href="./index.html">
            Search Photos
          </a>
        </h3>
        <form className="search-form">
          <Suges>
            <input
              type="text"
              name="search"
              className="user-input"
              placeholder="Search"
              onChange={handleSearch}
              value={searchField}
            />
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Search
            </button>
            <Suggestion
              searchField={searchField}
              selectedSuggestion={selectedSuggestion}
              onSelectSuggestion={onSelectSuggestion}
              displaySuggestions={displaySuggestions}
              suggestions={filteredSuggestions}
            />
          </Suges>
        </form>
      </Header>
      <Images listOfImages={images} />
      {flag ? (
        <NavButton>
          <button className="more" onClick={loadMore}>
            More
          </button>
        </NavButton>
      ) : (
        <div></div>
      )}
    </div>
  )
}

//styling for above components
const Header = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 20vh;
  justify-content: center;
  align-items: center;
  background-color: black;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  h3 {
    padding: 0.1rem;
    #logo {
      height: 0.1rem;
      text-decoration: none;
      color: white;
    }
  }

  .search-form {
    padding: 0.5rem;
    display: flex;
    input {
      font-size: 1.5rem;
      border: none;
      border: 2px solid rgb(76, 76, 148);
      padding: 0.5rem;
      width: 100%;
      border-radius: 0.2rem;
    }
    button {
      border: none;
      padding: 0.9rem;
      font-size: 1rem;
      background: rgb(76, 76, 148);
      color: white;
      position: absolute;
    }
  }
`

const Suges = styled.div`
  .user-input {
    width: 250px;
    padding: 5px 3px;
  }
  .suggestions-list {
    list-style: none;
    padding: 0;
    max-height: 160px;
    overflow-y: auto;
    max-width: 250px;
  }
  .suggestion {
    background-color: rgb(226, 181, 181);
    padding: 5px;
    color: rgb(65, 65, 65);
    cursor: pointer;
  }
  .suggestion:hover {
    background-color: rgba(238, 238, 238, 0.1);
  }
  .selected {
    background-color: rgb(148, 44, 44);
    color: rgb(238, 223, 223);
  }
`

const NavButton = styled.div`
  min-height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .more {
    padding: 1rem 3rem;
    background: rgb(76, 76, 148);
    color: white;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
`

export default Gallery
