require 'rspec/core/rake_task'
 	
RSpec::Core::RakeTask.new

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

root_dir = File.dirname(__FILE__)

js_dir = File.join(root_dir, 'client', 'js')
js_min = File.join(js_dir, 'app.min.js')
js_sources = Dir.glob(File.join(js_dir, '**', '*.js')).select do |f| 
  f !~ %r{\.min\.js} 
end.sort

js_test_dir = File.join(root_dir, 'spec', 'javascripts')
js_test_sources = []
['controllers', 'filters', 'helpers', 'services'].each do |dir|
  files= Dir.glob(File.join(js_test_dir, dir, '*.js')).select do |f| 
    f !~ %r{\.min\.js} 
  end.sort
  js_test_sources.concat files
end

js_linter = {
  command: 'gjslint',
  options: [ '--max_line_length 100', 
             '--disable 0120,0130'
           ],
}
js_compiler = {
  command: 'java -jar ~/.closure-compiler/compiler.jar',
  options: [ '--compilation_level SIMPLE_OPTIMIZATIONS' ],
  source_flag: '--js',
  target_flag: '--js_output_file'
}

desc "Run gjslint on js source and test files"
task :jslint do |t|
  (js_sources + js_test_sources).each do |s|
    sh %{#{js_linter[:command]} #{js_linter[:options].join(' ')} #{s}} do |ok, res|
    end
  end
end

desc "Minify js source files with Closure compiler"
task :jsmin => [js_min]

file js_min => js_sources do |t|
  sh %{#{js_compiler[:command]} #{js_compiler[:options].join(' ')} #{js_compiler[:source_flag]} #{t.prerequisites.join(%{ #{js_compiler[:source_flag]} })} #{js_compiler[:target_flag]} #{t.name}}
end
