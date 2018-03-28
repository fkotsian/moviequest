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
  const searchUri = OMDB_API_URL + '/?apikey=' + OMDB_API_KEY + '&s=' + movieName + '&type=movie&r=json'

  return window.fetch(searchUri)
    .then(res => {
      return res.json()
    })
    .then(json => {
      return json['Search']
    })
}

/*
 * Clear the #searchResults div
 * Returns: null
 */
function clearSearchResults() {
  // clear the `searchResults` div
  let searchResultsElement = document.getElementById('searchResults')

  while (searchResultsElement.firstChild) {
    searchResultsElement.removeChild(searchResultsElement.firstChild)
  }
}

/*
 * Append standardized movie data to the DOM
 * Returns: null
 */
function appendMovies(movies) {
  let searchResultsElement = document.getElementById('searchResults')

  // provide some helper text if there are no movies
  if (!movies || movies.length === 0) {
    let noResults = document.createElement('div')
    noResults.innerHTML = 'No movies found!'
    searchResultsElement.appendChild(noResults)
    return
  }


  // loop through the movie JSON and append a <div> for each movie
  movies.forEach(movieJson => {
    let movie = document.createElement('div')

    let favoriteIcon = document.createElement('span')
    favoriteIcon.innerHTML = '⭐'
    favoriteIcon.onclick = saveMovie
    favoriteIcon.dataset.title = movieJson['Title']
    favoriteIcon.dataset.oid = movieJson['imdbID']
    movie.appendChild(favoriteIcon)

    let movieTitle = document.createElement('span')
    movieTitle.innerHTML = movieJson['Title']
    movieTitle.onclick = getDetails
    movie.appendChild(movieTitle)

    searchResultsElement.appendChild(movie)
  })

}

/*
 * Search: call the OMDB API with our search query, and pass the result JSON
 *  to our rendering function (which adds it to the DOM)
 * Returns: Promise
 */
function search() {
  let movieNameElement = document.getElementById('movieName')
  let movieName = movieNameElement.value

  return searchOMDB(movieName)
    .then(moviesJson => {
      clearSearchResults()
      return appendMovies(moviesJson)
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
function appendMovieDetails(details, movieElement) {
  // create a list of movie details
  let movieDetails = document.createElement('ul')

  // create a list item for each movie attribute and add it to the details list
  MOVIE_ATTRS.forEach(attr => {
    let movieItem = document.createElement('li')
    movieItem.innerHTML = `${attr}: ${details[attr]}`
    movieDetails.appendChild(movieItem)
  })
  // append movie poster
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
  const detailsUri = OMDB_API_URL + '/?apikey=' + OMDB_API_KEY + '&t=' + title + '&type=movie&plot=full&r=json'

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
      return appendMovieDetails(detailsJson, movieDiv)
    })
    .catch(err => {
      console.error("Error fetching movie details!")
      console.error(err)
    })
}

/*
 * Save a movie title and oid to the Favorites list
 * Returns: null
 */
function saveMovie(iconElement) {
  const postUri = '/favorites'

  let movieData = {
    name: iconElement.target.dataset.title,
    oid: iconElement.target.dataset.oid,
  }

  return window.fetch(
    postUri,
    {
      method: 'POST',
      body: JSON.stringify(movieData),
      headers: {
        'content-type': 'application/json',
      },
    },
  )
  .then(res => {
    return res.json()
  })
  .catch(err => {
    console.error("Error favoriting movie!")
    console.error(err)
  })
}

/*
 * Fetch all favorites from our API
 * Returns: JSON
 */
function fetchFavorites() {
  const favoritesUri = '/favorites'

  return window.fetch(favoritesUri)
    .then(res => {
      return res.json()
    })
}

/*
 * Fetch favorites from the API, then append them to the DOM
 * Returns: null
 */
function loadFavorites() {
  return fetchFavorites()
    .then(favorites => {
      // transform favorites into the standardized format understood by our
      //  appendMovies method
      let standardizedFaves = favorites.map(f => (
        {
          'Title': f.name,
          'imdbID': f.oid,
        }
      ))

      clearSearchResults()
      appendMovies(standardizedFaves)
    })
    .catch(err => {
      console.error("Error loading favorites!")
      console.error(err)
    })
}
