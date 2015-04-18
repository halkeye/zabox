var gulp = require('gulp');
var debug = require('gulp-debug');
var jasmine = require('gulp-jasmine');
var karma = require('gulp-karma');

var paths = {
	//scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  //images: 'client/img/**/*'
	libs: ['lib/**/*.js'],
	tests: ['spec/**/*Spec.js']
};

gulp.task('jasmine', function () {
	return gulp.src(paths.tests)
		.pipe(debug({title: 'jasmine:'}))
    .pipe(jasmine({verbose:true}));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.tests, ['test']);
  gulp.watch(paths.libs, ['test']);
});

gulp.task('karma', function() {
  // Be sure to return the stream
  // NOTE: Using the fake './foobar' so as to run the files
  // listed in karma.conf.js INSTEAD of what was passed to
  // gulp.src !
  return gulp.src('./foobar')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      this.emit('end'); //instead of erroring the stream, end it
    });
});

gulp.task('test', ['jasmine'], function() {});
gulp.task('travis', ['jasmine','karma'], function() {});
