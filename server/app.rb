require 'sinatra/base'
# require 'json'

# require_relative './lib/clock_collection'

class JLogApp < Sinatra::Base

  class << self
    attr_accessor :styles, :scripts, :manifest
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

  @styles = []
  @scripts = []

  configure :production do
    @manifest = "production.appcache"
  end

  configure :test do
    @manifest = "test.appcache"
  end

  configure :production, :test do
    @styles << 'lib/bootstrap/css/bootstrap.min.css'
    @styles << 'css/app.css'

    @scripts << 'lib/angular/angular.min.js'
    @scripts << 'lib/angular/angular-ui-router.min.js'
    @scripts << 'lib/angular/bindonce.js'
    @scripts << 'js/app.min.js'
  end

  configure :development do
    @styles << 'lib/bootstrap/css/bootstrap.css'
    @styles << 'css/app.css'

    @scripts << 'lib/angular/angular.js'
    @scripts << 'lib/angular/angular-ui-router.js'
    @scripts << 'lib/angular/bindonce.js'
    @scripts << 'js/app.js'
    @scripts << 'js/controllers/mainCtrl.js' 
    @scripts << 'js/controllers/listCtrl.js' 
    @scripts << 'js/controllers/listViewCtrl.js' 
    @scripts << 'js/controllers/listEditCtrl.js' 
    @scripts << 'js/controllers/statsCtrl.js' 
    @scripts << 'js/controllers/backupCtrl.js' 
    @scripts << 'js/services/factions.js' 
    @scripts << 'js/services/opponents.js' 
    @scripts << 'js/services/events.js' 
    @scripts << 'js/services/scenarios.js' 
    @scripts << 'js/services/tags.js' 
    @scripts << 'js/services/scores.js' 
    @scripts << 'js/services/battle.js' 
    @scripts << 'js/services/sort.js' 
    @scripts << 'js/services/filter.js' 
    @scripts << 'js/services/backup.js' 
    @scripts << 'js/services/stats.js' 
    @scripts << 'js/services/selection.js' 
    @scripts << 'js/services/battleListDisplay.js' 
    @scripts << 'js/directives/sortable.js' 
    @scripts << 'js/directives/whenScrolled.js' 
    @scripts << 'js/directives/collapse.js' 
    @scripts << 'js/directives/export_link.js' 
    @scripts << 'js/directives/statBar.js' 
    @scripts << 'js/filters/scoreResultColorFilter.js'
    @scripts << 'js/filters/capitaliseFilter.js'
    @scripts << 'js/filters/filterBattleFilter.js'
    @scripts << 'js/filters/initiativeFilter.js'

    @manifest = '/development.appcache'
  end

  # attr_reader :clocks

  def initialize
    super
  #   @clocks = ClockCollection.new
  end

  set :server, :thin
  set :public_folder, File.join(File.dirname(__FILE__), '..', 'client')
  set :views, File.join(File.dirname(__FILE__), '..', 'client')

  get "/" do
    redirect '/index.html'
  end

  get '/index.html' do
    erb :index
  end

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
