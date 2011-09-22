# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'bundler' do
  watch('Gemfile')
end

guard 'nanoc' do
  watch(/^config.yaml/)
  watch(/^Rules/)
  watch(/^layouts\//)
  watch(/^content\//)
end

guard 'livereload' do
  watch(%r{public/.+\.(css|js|html)})
end

guard 'coffeescript', :input => 'content/coffeescripts', :output => 'content/javascripts'
