##########################################################
# Rake tasks for Sample project
#
# Show tasks
# > rake -T
# 
##########################################################
BASE_NAME = "gbeam"
JS_CONCAT_FILE    = BASE_NAME + ".debug.js" 
JS_MIN_FILE       = BASE_NAME + ".js"
CSS_CONCAT_FILES  = [BASE_NAME + "@2x.debug.css", BASE_NAME + ".debug.css"]
CSS_MIN_FILES     = [BASE_NAME + "@2x.css", BASE_NAME + ".css"]

##########################################################
# Directories
##########################################################
BASE_DIR = File.expand_path(File.dirname(__FILE__))
SRC_DIR       = File.join(BASE_DIR, "/src/js")
CSS_DIR       = File.join(BASE_DIR, "/src/css")
DIST_DIR      = File.join(BASE_DIR, "/dist")
TEST_DIR      = File.join(BASE_DIR, "/test")
ESCAPE_SCRIPT = File.join(BASE_DIR, "/build/escapeUTF16.js")
CHECK_SCRIPT  = File.join(BASE_DIR, "/build/check.js")
CONCAT_SCRIPT = File.join(BASE_DIR, "/build/concat.js --root " + SRC_DIR + " --template all.js")
CLEAN_CSS_LIB = File.join(BASE_DIR, "/build/node_modules/clean-css/bin/cleancss")
MINIFY_LIB    = File.join(BASE_DIR, "/build/node_modules/uglify-js/bin/uglifyjs --ascii")

JS_TEMPLATE_FILE  = SRC_DIR + "all.js"
CSS_TEMPLATE_FILE = CSS_DIR + "all.css"

##########################################################
# Load modules
##########################################################
require 'rake'
require 'rake/clean'
require 'rake/packagetask'
import  "#{Dir.pwd}/test/test.rake"

##########################################################
# Generate files
##########################################################
SRCS = FileList["dist/*.*"]
OBJS = FileList["test/public/javascripts/*.*"]
CLEAN.include(SRCS)
CLOBBER.include(OBJS)

##########################################################
# Tasks
##########################################################
desc "Setup workspace and checkout modules"
task :setup_workspace do
  puts '------------------------'
  puts 'Setup workspace and checkout modules'
  puts '------------------------'

  sh "git submodule init"
  sh "git submodule update"

  # Fix module version
  Dir.chdir(File.join(BASE_DIR, 'build/node_modules/uglify-js')) do
    sh "git checkout 37aed3a2964cabd4c9bf4f0750cf15242ec00731"
  end
  Dir.chdir(File.join(BASE_DIR, 'build')) do
    sh "npm install optimist@0.3.1"
    sh "npm install mu2@0.5.13"
    sh "npm install clean-css@0.3.2"
  end
end

desc "Convert unescaped js files to utf16-escaped format (\\uXXXX)"
task :escape_utf16 do
  Dir["#{SRC_DIR}/**/*.unescaped.js"].each do |file_name|
    escaped_file_name = file_name.sub(/\.unescaped\./, ".")
    sh "#{ESCAPE_SCRIPT} < #{file_name} > #{escaped_file_name}"
  end
end

directory DIST_DIR
desc "Concat all javascript files"
task :default => [:escape_utf16, DIST_DIR]  do
  puts '------------------------'
  puts 'Concat js and css files.'
  puts '------------------------'

  # Concat all js files
  file_name = File.join(DIST_DIR, JS_CONCAT_FILE)
  sh "#{CONCAT_SCRIPT} > #{file_name}"
  puts 'Created ' + file_name

  # Concat all css files (if needed)
  #
  #Dir.chdir(DIST_DIR) do
  #  sh "sed s/@2x//g #{CSS_CONCAT_FILES[0]} > #{CSS_CONCAT_FILES[1]}"
  #end
  #puts 'Created ' + File.join(DIST_DIR, CSS_CONCAT_FILES[0])
  #puts 'Created ' + File.join(DIST_DIR, CSS_CONCAT_FILES[1])
end

desc "Check concat JavaScript file by jshint"
task :check => :default do
  puts '------------------------'
  puts 'Check js file'
  puts '------------------------'
  file_name = File.join(DIST_DIR, JS_CONCAT_FILE)
  sh "#{CHECK_SCRIPT} < #{file_name}"
end

desc "Minify JavaScript file"
task :minify => :check do
  puts '------------------------'
  puts 'Minify js file'
  puts '------------------------'
  in_file = File.join(DIST_DIR, JS_CONCAT_FILE)
  out_file = File.join(DIST_DIR, JS_MIN_FILE)
  sh "#{MINIFY_LIB} #{in_file} > #{out_file}"

  # Minify CSS (if needed)
  # 
end

desc "Deploy files for debug"
task :debug => :concat do
  puts '------------------------'
  puts 'Deploy debug files'
  puts '------------------------'

end

desc "Deploy files for release"
task :release => :minify do
  puts '------------------------'
  puts 'Deploy release files'
  puts '------------------------'
end

desc "Run unit tests"
task :citest => :minify do
  puts '------------------------'
  puts 'Run jasmin ci test'
  puts '------------------------'
  testfileDir = File.join(TEST_DIR, 'public/javascripts')
  cp File.join(DIST_DIR, JS_MIN_FILE), File.join(testfileDir, JS_MIN_FILE)

  Dir.chdir(TEST_DIR) do
    Rake::Task["jasmine:ci"].invoke
  end

end

desc "Start test server"
task :testserver do
  Dir.chdir(TEST_DIR) do
    Rake::Task["jasmine"].invoke
  end
end

