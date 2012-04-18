begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

begin
  require 'jasmine-headless-webkit'

  Jasmine::Headless::Task.new('jasmine:headless') do |t|
    File.join(TEST_DIR, "spec/javascripts/support/jasmine.yml")
    t.colors = true
    t.keep_on_error = true
    t.jasmine_config = File.join(TEST_DIR, "spec/javascripts/support/jasmine.yml")
  end

rescue LoadError

  namespace :jasmine do
    task :headless do
      abort "Jasmine-headless-webkit is not available. In order to run jasmine:headless, you must: (sudo) gem install jasmine-headless-webki"
    end
  end
end

