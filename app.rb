require 'sinatra'

# FIX: added do statement to begin block
get '/' do
  # FIX: look inside views folder for index.html
  File.read('views/index.html')
end

# FIX: added starting '/' to GET route
get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

# FIX: changed method to POST
post '/favorites' do
  file = JSON.parse(File.read('data.json'))

  # FIX: added end statement to complete `unless`
  # - could also use `return ... unless ...` single-line pattern
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end

  movie = { name: params[:name], oid: params[:oid] }
  file << movie
  File.write('data.json', JSON.pretty_generate(file))

  # FIX: added JSON Content-Type header
  response.header['Content-Type'] = 'application/json'
  movie.to_json
end
