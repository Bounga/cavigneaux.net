HOST = "www.cavigneaux.net"
REMOTE_USER = "nico"
REMOTE_DIRECTORY = "/var/www/cavigneaux/"

task default: [:build]

desc 'Build public content'
task :build do
  system('JEKYLL_ENV=production jekyll build')
end

desc 'Deploy site on web server'
task deploy: [:build] do
  puts "Sync files on Web server"
  system("rsync -az --no-t --no-p --delete -e ssh _site/ #{REMOTE_USER}@#{HOST}:#{REMOTE_DIRECTORY}")
  puts "Deployment done!"
end
