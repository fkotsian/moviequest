const OMDB_API_URL = 'http://www.omdbapi.com'
// TODO: ideally, hide this key by making requests to the API from the server
// - To make sure your key is secure:
//  - load the key in from ENV via something like [Dotenv](https://github.com/bkeepers/dotenv)
//  - make request to your server, which then makes request to the API
//  - for this app, API key security isn't really an issue, so let's roll with exposing it here
const OMDB_API_KEY = '6bf9876f'

/*
 * Search the API for the submitted movie
 * Returns: JSON
 */
function searchOMDB(movieName, callback) {
  let searchUri = OMDB_API_URL + '/?apikey=' + OMDB_API_KEY + '&s=' + movieName + '&type=movie&r=json'

  return window.fetch(searchUri)
    .then(res => {
      return res.json()
    })
    .then(json => {
      let movieJson = json['Search']

      if (callback) {
        return callback(movieJson)
      }
      else {
        return movieJson
      }
    })
    .catch(err => {
      console.error("Error searching OMDB!")
      console.error(err)
    })
}

/*
 * Insert the movie JSON into the DOM
 * Returns: null
 */
function renderMovieResults(movies) {
  // create a new <div> element to hold the search results
  let movieContainer = document.createElement('div')

  // loop through the movie JSON and add a <div> for each movie
  movies.forEach(movieJson => {
    let movie = document.createElement('div')

    let movieTitle = document.createElement('h4')
    movieTitle.innerHTML = movieJson['Title']
    movie.appendChild(movieTitle)

    movieContainer.appendChild(movie)
  })

  // clear the `searchResults` div and append our new `movieContainer` div!
  let searchResultsElement = document.getElementById('searchResults')
  while (searchResultsElement.firstChild) {
    searchResultsElement.removeChild(searchResultsElement.firstChild)
  }

  searchResultsElement.appendChild(movieContainer)
}

/*
 * The master method: kick off the search process & tie the helper methods together
 * - calls the searchOMDB method (which fetches our JSON)
 * - passes the renderMovieResults function as a callback (
 * Returns: Function
 */
function search() {
  let movieNameElement = document.getElementById('movieName')
  let movieName = movieNameElement.value

  return searchOMDB(movieName, renderMovieResults)
}

