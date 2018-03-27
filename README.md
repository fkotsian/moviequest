# MovieSearch!

## What is this?

An API client to search the OMDB movie database for your favorite films, and save your favorites.

## Implementation Details

I was unsure of what level the students would be at when encountering this project, so I made some judgment calls on concepts. Those concepts are listed below:

- ES6:
  - I used modern ES6 syntax and concepts (Fetch API, promises) to ensure our students are up to speed on the latest in the job market.
- Callbacks as Parameters:
  - I used callbacks and passed functions as parameters in the search functions as I think it's good practice to learn separation of responsibilities; however, for beginner/intermediate students, I wouldn't pass callbacks as parameters out of concern for readability.
  - While students are learning Javascript syntax, I'd find it more intuitive to write one large function, then extract pieces during a refactor.
