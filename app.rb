require 'sinatra'

# added do statement to begin block
get '/' do
  # look inside views folder for index.html
  File.read('views/index.html')
end

# added starting '/' to GET route
get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

# changed method to POST
post '/favorites' do
  file = File.read('data.json')
  if file.length > 0
    movies_json = JSON.parse(file)
  else
    movies_json = []
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

  movie_exists = movies_json.any? { |saved_movie| saved_movie['oid'] == movie[:oid] }

  # do not re-write the movie if already favorited
  unless movie_exists
    movies_json << movie
    File.write('data.json', JSON.pretty_generate(movies_json))
  end

  # added JSON Content-Type header
  response.header['Content-Type'] = 'application/json'

  movie.to_json
end
