const OMDB_API_URL = 'http://www.omdbapi.com'
// NB: ideally, hide this key by making requests to the API from the server
// - To make sure your key is secure:
//  - load the key in from ENV via something like [Dotenv](https://github.com/bkeepers/dotenv)
//  - make request to your server, which then makes request to the API
//  - for this app, API key security isn't really an issue, so let's roll with exposing it here
const OMDB_API_KEY = '6bf9876f'

const MOVIE_ATTRS = [
  'Genre',
  'Director',
  'Released',
  'Awards',
  'Runtime',
  'Plot',
]


/*
 * Search the API for the submitted movie title
 * Returns: JSON
 */
function searchOMDB(movieName) {
  let searchUri = OMDB_API_URL + '/?apikey=' + OMDB_API_KEY + '&s=' + movieName + '&type=movie&r=json'

  return window.fetch(searchUri)
    .then(res => {
      return res.json()
    })
    .then(json => {
      return json['Search']
    })
}

/*
 * Insert the movie JSON into the DOM
 * Returns: null
 */
function renderMovieResults(movies) {
  // clear the `searchResults` div and append our new `movieContainer` div!
  let searchResultsElement = document.getElementById('searchResults')
  while (searchResultsElement.firstChild) {
    searchResultsElement.removeChild(searchResultsElement.firstChild)
  }

  if (!movies || movies.length === 0) {
    let noResults = document.createElement('div')
    noResults.innerHTML = 'No matches were found for that title. Please try again!'
    searchResultsElement.appendChild(noResults)
    return
  }

  // loop through the movie JSON and append a <div> for each movie
  movies.forEach(movieJson => {
    let movie = document.createElement('div')

    let movieTitle = document.createElement('h4')
    movieTitle.innerHTML = movieJson['Title']
    movieTitle.onclick = getDetails
    movie.appendChild(movieTitle)

    searchResultsElement.appendChild(movie)
  })

}

/*
 * The master method: kick off the search process & tie the helper methods together
 * - calls the searchOMDB method (which fetches our JSON)
 * - passes result to renderMovieResults, which appends the movies to the DOM
 * Returns: Promise
 */
function search() {
  let movieNameElement = document.getElementById('movieName')
  let movieName = movieNameElement.value

  return searchOMDB(movieName, renderMovieResults)
    .then(moviesJson => {
      return renderMovieResults(moviesJson)
    })
    .catch(err => {
      console.error("Error searching OMDB!")
      console.error(err)
    })
}

/*
 * Create a list of movie details and append it to the DOM
 * Returns: null
 */
function renderMovieDetails(details, movieElement) {
  // create a list of movie details
  let movieDetails = document.createElement('ul')

  // create a list item for each movie attribute and add it to the details list
  MOVIE_ATTRS.forEach(attr => {
    let movieItem = document.createElement('li')
    movieItem.innerHTML = `${attr}: ${details[attr]}`
    movieDetails.appendChild(movieItem)
  })
  let posterItem = document.createElement('li')
  let posterImage = document.createElement('img')
  posterImage.src = details['Poster']
  posterItem.appendChild(posterImage)
  movieDetails.appendChild(posterItem)

  movieElement.appendChild(movieDetails)
}

/*
 * Fetch the movie details from the OMDB API, by title
 * Returns: Promise
 */
function requestMovieDetails(title) {
  let detailsUri = OMDB_API_URL + '/?apikey=' + OMDB_API_KEY + '&t=' + title + '&type=movie&plot=full&r=json'

  return window.fetch(detailsUri)
    .then(res => {
      return res.json()
    })
}

/*
 * Request the movie details from the API and append them to the DOM
 * Returns: Promise
 */
function getDetails(movieTitleElement) {
  let movieTitle = movieTitleElement.target.innerHTML
  let movieDiv = movieTitleElement.target.parentElement

  return requestMovieDetails(movieTitle)
    .then(detailsJson => {
      return renderMovieDetails(detailsJson, movieDiv)
    })
    .catch(err => {
      console.error("Error fetching movie details!")
      console.error(err)
    })
}
