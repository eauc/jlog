require 'sinatra/base'
require 'json'

require_relative './lib/log_collection'

class JLogApp < Sinatra::Base

  configure do
    mime_type :manifest, 'text/cache-manifest'
  end

  attr_reader :logs

  def initialize
    super
    @logs = LogCollection.new
    @git_commit = ENV['GIT_HEAD']
  end

  set :server, :thin
  set :public_folder, File.join(File.dirname(__FILE__), '..', 'client')
  set :static_cache_control, [:no_cache, :must_revalidate]
  set :views, File.join(File.dirname(__FILE__), '..', 'client')

  before do
    expires 0
    cache_control :no_cache, :must_revalidate
  end

  get '/' do
    redirect '/index.html'
  end

  get '/manifest.appcache' do
    content_type :manifest
    erb :manifest_appcache
  end

  get '/version.html' do
    erb :version
  end

  get '/api/status' do
    JSON.pretty_generate logs.status
  end

  get '/api/log' do
    JSON.pretty_generate logs.list
  end

  post '/api/log' do
    data = JSON.parse request.body.read
    id = logs.create data
    JSON.pretty_generate logs[id]
  end

  get '/api/log/:id' do
    id = params[:id]
    if logs.exists? id
      data = logs[id]
      JSON.pretty_generate data
    else
      status 404
    end
  end
end
