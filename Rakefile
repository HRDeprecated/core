rjs = "node_modules/requirejs/bin/r.js"

desc "rebuild the vendors/hr.js files for distribution"
task :build do
  check "#{rjs}", 'RequireJS', 'https://github.com/jrburke/r.js'
  system "#{rjs} -o ./src/require-config.js"
end

desc "build the documentation in docs/build"
task :doc do
  system './bin/hr.js -d docs build'
end

desc "run the documentation website"
task :run do
  system './bin/hr.js -d docs all'
end

desc "publish to npm"
task :run do
  system 'npm publish'
end

desc "run the sample"
task :sample do
  system './bin/hr.js -d skeleton all'
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