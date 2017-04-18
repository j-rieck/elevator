var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    webpack = require('webpack-stream');

gulp.task("build", function () {
    gulp.start("js");
});

gulp.task("default", function () {
    return gulp.src("src/building.js")
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(webpack(require("./webpack.config.js")))
            .pipe(gulp.dest('dist'))
            .pipe(livereload({ start: true }));
});