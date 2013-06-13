desc "rebuild the vendors/yapp.js files for distribution"
task :build do
  check 'r.js', 'RequireJS', 'https://github.com/jrburke/r.js'
  system 'r.js -o ./src/require-config.js'
end

desc "build the documentation in docs/build"
task :doc do
  system './bin/yapp.js -d docs build'
end

desc "run the documentation website"
task :run do
  system './bin/yapp.js -d docs all'
end

desc "run the sample"
task :sample do
  system './bin/yapp.js -d skeleton all'
end

desc "install dependencies using npm"
task :dependencies do
  check 'npm', 'NPM', 'https://npmjs.org/'
  system 'npm install .'
end

task :default => ['dependencies', 'build', 'run']

# Check for the existence of an executable.
def check(exec, name, url)
  return unless `which #{exec}`.empty?
  puts "#{name} not found.\nInstall it from #{url}"
  exit
end