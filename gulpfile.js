var gulp = require('gulp');
var debug = require('gulp-debug');
var jasmine = require('gulp-jasmine');

var paths = {
	//scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  //images: 'client/img/**/*'
	libs: ['lib/**/*.js'],
	tests: ['spec/**/*Spec.js']
};

gulp.task('test', function () {
	return gulp.src(paths.tests)
		.pipe(debug({title: 'jasmine:'}))
    .pipe(jasmine({verbose:true}));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.tests, ['test']);
  gulp.watch(paths.libs, ['test']);
});
