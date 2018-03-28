# MovieQuest!

## What is this?

An API client to search the OMDB movie database for your favorite films, and save your favorites.

Built in Vanilla JS.

[Heroku: https://ga-moviequest.herokuapp.com/](https://ga-moviequest.herokuapp.com/)

## Implementation Details

I was unsure of what level the students would be at when encountering this project, so I made some judgment calls on concepts. Those concepts are listed below:

- ES6:
  - I used modern ES6 syntax and concepts (Fetch API, promises)
  - Alternatives would include XMLHttpRequest and callbacks
- Code Reuse:
  - I refactored out useful methods as they came along, notably `appendMovies`
  - I standardized the data `appendMovies` expected, to allow it to be used regardless of where movies were loaded from
- DOM Management:
  - I used `element.appendChild` often to imperatively add elements to the DOM
  - In retrospect, I would have much preferred a functional React-like method, which would read a global `movies` object, and render it into the DOM. `fetch` methods would pass data into this global object.
  - This would make a simpler bridge into React and Redux

## Extensions

- CSS: I'd like to style the movie details more (perhaps some box-shadow, backgrounds, ...)
- Toggles: It could be cool to be able to hide or minimize the movie details after loading them. This could be done by toggling a `visibility` class, or otherwise
- Unfavoriting: It could be cool to load the 'saved' status of any movie when it is loaded from the Seach API. This would require querying our database as well, which is expensive. However, it is required in order to be able to unfavorite movies.

## Javascript MVC

I would love to rewrite this application in React. I think it would actually make a lot of tasks easier (DOM manipulation), at the cost of more boilerplate code.

Benefits:
- Conventions: you don't have to think about where everything goes! Because React starts from the DOM and provides lifecycle hooks for certain actions (loading data, updating data), it can make writing a complex application much easier to think about. You just start from what you want to see, and then build up from there. This can be helpful, especially with complex applications!
- Reasonable state management: because React computes the DOM based on state, we no longer have to programmatically add + delete DOM elements whenever we grab new data. This can make the state of the view much easier to reason about.
- Componentization: the data types provided by React (or any JS MVC) give you some boundaries that help with knowing when to refactor. For example, React's Components help by drawing you attention to when a component is doing too much. Advanced conventions like container vs presentational components help draw this line even more clearly.
- State is top-of-mind: React makes it easy to know what the state of your application is at any time because it makes state a primary concern for you. In this app, this would be particularly helpful for favoriting. Rather than storing the movie's title and OID as data-attributes or grabbing them from the DOM, we could simply grab them from memory (component State). This results in fewer operations, and gives you fewer things to keep track of.
- Styling: funnily enough, having to add classes (and wrapper divs!) programmatically to the DOM is really annoying (and clutters your code!). Being able to write in JSX and toggle classes in response to state change takes a minute to get used to, but is much cleaner once you are used to the convention.

Challenges:
- Harder!: There's more to keep track of initally, and you have to learn the conventions of the framework before MVCs start to feel more like superpowers than baggage. Students will have to learn to think in terms of components, composable functions, and global state. This may be more natural for some students than for others.
- Boilerplate: Writing boilerplate code and following conventions can be challenging for new students who want to learn what everything does right away. It may require some patience and careful scaffolding of concepts to help students not bite off too much of the framework at once! I would probably deal with this by introducing concepts slowly in class, and meeting with students outside of class to discuss the inner workings of React.
- Dev Tooling: React/Redux are supported by a growing ecosystem of dev tools, from Webpack and Babel to Prettier. These can be overwhelming at first, so it will help to abstract some of them away using e.g. `create-react-app`, or by providing recommended configurations, so that students can focus on learning the core concepts, and not the supporting tools.

I find that the basic concepts of React can be taught in a few hours, but really mastering thinking in React takes a couple weeks to really sink in. It'd be exciting to introduce students to the concepts in a structured way, and help them really dig into lifecycles, components, and state management with Flux/Redux as they work through their projects.

Thanks!
