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
 * Clear the #movies div
 * Returns: null
 */
function clearMovies() {
  // clear the `movies` div
  let searchResultsElement = document.getElementById('movies')

  while (searchResultsElement.firstChild) {
    searchResultsElement.removeChild(searchResultsElement.firstChild)
  }
}

/*
 * Append standardized movie data to the DOM
 * Returns: null
 */
function appendMovies(movies) {
  let searchResultsElement = document.getElementById('movies')

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
    favoriteIcon.classList.add('clickable')
    movie.appendChild(favoriteIcon)

    let movieTitle = document.createElement('span')
    movieTitle.innerHTML = movieJson['Title']
    movieTitle.onclick = loadMovieDetails
    movieTitle.classList.add('clickable')
    movieTitle.classList.add('movieTitle')
    movie.appendChild(movieTitle)

    searchResultsElement.appendChild(movie)
  })
}

/*
 * Search the API for the submitted movie title
 * Returns: JSON
 */
function fetchSearchResults(movieName) {
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
 * Search: call the OMDB API with our search query, and pass the result JSON
 *  to our rendering function (which adds it to the DOM)
 * Returns: Promise
 */
function search() {
  let movieNameElement = document.getElementById('movieName')
  let movieName = movieNameElement.value

  return fetchSearchResults(movieName)
    .then(moviesJson => {
      clearMovies()
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
  let movieDetails = document.createElement('div')
  movieDetails.classList.add('details')

  // append movie poster
  let detailsImage = document.createElement('img')
  detailsImage.src = details['Poster']
  movieDetails.appendChild(detailsImage)

  // create a list of movie details
  let detailsList = document.createElement('ul')
  detailsList.classList.add('detailsList')
  MOVIE_ATTRS.forEach(attr => {
    let detailItem = document.createElement('li')
    detailItem.innerHTML = `${attr}: ${details[attr]}`
    detailsList.appendChild(detailItem)
  })
  movieDetails.appendChild(detailsList)

  movieElement.appendChild(movieDetails)
}

/*
 * Fetch the movie details from the OMDB API, by title
 * Returns: Promise
 */
function fetchMovieDetails(title) {
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
function loadMovieDetails(movieTitleElement) {
  let movieTitle = movieTitleElement.target.innerHTML
  let movieDiv = movieTitleElement.target.parentElement

  return fetchMovieDetails(movieTitle)
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

      clearMovies()
      appendMovies(standardizedFaves)
    })
    .catch(err => {
      console.error("Error loading favorites!")
      console.error(err)
    })
}
