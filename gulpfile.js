var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    //cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    //uglify = require('gulp-uglify'),
    //imagemin = require('gulp-imagemin'),
    //rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    //notify = require('gulp-notify'),
    //cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task("build", function () {
    gulp.start("js");
});

gulp.task("js", function () {
    return gulp.src("src/*.js")
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(concat('main.js'))
            .pipe(gulp.dest('dist'));
})

gulp.task('default', function() {

  // Watch .scss files
  //gulp.watch('src/styles/**/*.less', ['styles']);

  // Watch .js files
  gulp.watch('src/*.js', ['js']);
});