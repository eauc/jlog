require 'sinatra/base'
# require 'json'

# require_relative './lib/clock_collection'

class JLogApp < Sinatra::Base

  class << self
    # attr_accessor :styles, :scripts, :manifest
    # attr_accessor :resources
  end

  # @resources = {}
  # @resources[:root] = {
  #   href: 'api',
  #   type: 'resource/api',
  #   link: []
  # }
  # @resources[:status] = {
  #   href: "#{@resources[:root][:href]}/status",
  #   type: 'resource/status'
  # }
  # @resources[:root][:link] << {
  #   rel: 'resource/status',
  #   href: @resources[:status][:href]
  # }
  # @resources[:clock_collection] = {
  #   href: "#{@resources[:root][:href]}/clock",
  #   type: 'collection/clocks'
  # }
  # @resources[:root][:link] << {
  #   rel: 'collection/clocks',
  #   href: @resources[:clock_collection][:href]
  # }

  configure do
    mime_type :manifest, 'text/cache-manifest'
  end

  # configure :production do
  #   require 'newrelic_rpm'
  # end

  # @styles = []
  # @scripts = []

  # configure :production do
  #   @manifest = "production.appcache"
  # end

  # configure :test do
  #   @manifest = "test.appcache"
  # end

  # configure :production, :test do
  #   @styles << 'lib/bootstrap/css/bootstrap.min.css'
  #   @styles << 'lib/brick/brick-1.0beta7.byob.min.css'
  #   @styles << 'css/app.css'

  #   @scripts << 'lib/brick/brick-1.0beta7.byob.min.js'
  #   @scripts << 'lib/angular/angular.min.js'
  #   @scripts << 'lib/angular/angular-route.min.js'
  #   @scripts << 'js/app.min.js'
  # end

  # configure :development do
  #   @styles << 'lib/bootstrap/css/bootstrap.css'
  #   @styles << 'lib/brick/brick-1.0beta7.byob.min.css'
  #   @styles << 'css/app.css'

  #   @scripts << 'lib/brick/brick-1.0beta7.byob.min.js'
  #   @scripts << 'lib/angular/angular.js'
  #   @scripts << 'lib/angular/angular-route.js'
  #   @scripts << 'js/app.js'
  #   @scripts << 'js/services/pubsub.js'
  #   @scripts << 'js/services/core.js'
  #   @scripts << 'js/services/watchElement.js'
  #   @scripts << 'js/services/api.js'
  #   @scripts << 'js/services/applicationCache.js'
  #   @scripts << 'js/services/resource.js'
  #   @scripts << 'js/services/resourceCollection.js'
  #   @scripts << 'js/services/eventSource.js'
  #   @scripts << 'js/services/statusResource.js'
  #   @scripts << 'js/services/timestamp.js'
  #   @scripts << 'js/services/time.js'
  #   @scripts << 'js/services/clock.js'
  #   @scripts << 'js/services/twoPlayerClock.js'
  #   @scripts << 'js/services/twoPlayerClockResource.js'
  #   @scripts << 'js/services/help.js'
  #   @scripts << 'js/controllers/mainCtrl.js'
  #   @scripts << 'js/controllers/homeCtrl.js'
  #   @scripts << 'js/controllers/clockCtrl.js'
  #   @scripts << 'js/filters/time2digits.js'
  #   @scripts << 'js/filters/capitalise.js'
  #   @scripts << 'js/filters/activeMark.js'
  #   @scripts << 'js/filters/stateColor.js'
  #   @scripts << 'js/directives/helpStep.js'
  #   @scripts << 'js/directives/clockDisplay.js'
  #   @scripts << 'js/directives/clockForm.js'
  #   @scripts << 'js/directives/clockBip.js'
  #   @scripts << 'js/directives/collapse.js'

    @manifest = '/test.appcache'
  # end

  # attr_reader :clocks

  def initialize
    super
  #   @clocks = ClockCollection.new
  end

  set :server, :thin
  set :public_folder, File.join(File.dirname(__FILE__), '..', 'client')
  set :views, File.join(File.dirname(__FILE__), '..', 'client', 'views')

  get "/" do
    redirect '/index.html'
  end

  # get '/index.html' do
  #   erb :index
  # end

  # get "/#{resources[:root][:href]}" do
  #   self.class.resources[:root].to_json
  # end

  # get "/#{resources[:status][:href]}" do
  #   clocks.status.merge(self.class.resources[:status]).to_json
  # end

  # get "/#{resources[:clock_collection][:href]}" do
  #   JSON.pretty_generate clocks.list.merge(self.class.resources[:clock_collection])
  # end

  # def self.api_clock_resource id
  #   {
  #     href: "#{resources[:clock_collection][:href]}/#{id}",
  #     type: 'resource/clock',
  #     subscribe: {
  #       href: "#{resources[:clock_collection][:href]}/#{id}/subscribe"
  #     }
  #   }
  # end

  # post "/#{resources[:clock_collection][:href]}" do
  #   data = JSON.parse request.body.read
  #   id = clocks.create data
  #   clocks[id].merge! self.class.api_clock_resource(id)
  #   clocks[id].to_json
  # end

  # get "/#{resources[:clock_collection][:href]}/:id" do
  #   id = params[:id]
  #   if clocks.exists? id
  #     data = clocks[id]
  #     data.to_json
  #   else
  #     status 404
  #   end
  # end

  # post "/#{resources[:clock_collection][:href]}/:id" do
  #   id = params[:id]
  #   if clocks.exists? id
  #     data = JSON.parse request.body.read
  #     data.merge! self.class.api_clock_resource(id)
  #     clocks[id] = data
  #     clocks[id].to_json
  #   else
  #     status 404
  #   end
  # end

  # get "/#{resources[:clock_collection][:href]}/:id/subscribe", :provides => 'text/event-stream' do
  #   id = params[:id]
  #   if clocks.exists? id
  #     stream(:keep_open) do |out| 
  #       out.callback { clocks.removeConnection id, out }
  #       out << "retry:0\n\n"
  #       clocks.addConnection id, out
  #     end
  #   else
  #     status 404
  #   end
  # end

  get @manifest do
    content_type :manifest
  end

  # configure :test, :development do
  #   get "/#{resources[:clock_collection][:href]}/:id/purge" do
  #     id = params[:id]
  #     if clocks.exists? id
  #       clocks.closeAllConnections id
  #       "done"
  #     else
  #       status 404
  #     end
  #   end
  # end
end
