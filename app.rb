require 'sinatra'

# added do statement to begin block
get '/' do
  # look inside views folder for index.html
  File.read('views/index.html')
end

# added starting '/' to GET route
get '/favorites' do
  response.header['Content-Type'] = 'application/json'

  file = File.read('data.json')
  if file.length > 0
    favorites = JSON.parse(file)
  else
    favorites = []
  end

  favorites.to_json
end

# changed method to POST
post '/favorites' do
  file = File.read('data.json')
  if file.length > 0
    favorites = JSON.parse(file)
  else
    favorites = []
  end

  # use request body over query params for POST data
  # - remember to rewind the body before reading it (Sinatra treats it as a stream)
  request.body.rewind
  body = JSON.parse(request.body.read)

  # added end statement to complete `unless`
  # - could also use `return ... unless ...` single-line pattern
  unless body['name'] && body['oid']
    # return status code with error response body
    halt 400, 'Invalid Request'
  end

  movie = { name: body['name'], oid: body['oid'] }

  movie_exists = favorites.any? { |fav| fav['oid'] == movie[:oid] }

  # do not re-write the movie if already favorited
  unless movie_exists
    favorites << movie
    File.write('data.json', JSON.pretty_generate(favorites))
  end

  # added JSON Content-Type header
  response.header['Content-Type'] = 'application/json'

  movie.to_json
end
