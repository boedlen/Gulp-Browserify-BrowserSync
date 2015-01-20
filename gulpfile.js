'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var sass        = require('gulp-sass');

var browseifyBundler = watchify(browserify('./src/js/main.ts', watchify.args))
                        .plugin('tsify', {target: 'ES5'});

gulp.task('ts', bundleTypescript );
browseifyBundler.on('update', bundleTypescript);


// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./public"
        }
    });
});

// Sass task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'))
        .pipe(reload({stream:true}));
});

// Default task to be run with `gulp`
gulp.task('default', ['sass', 'ts', 'browser-sync'], function () {
    gulp.watch("src/scss/*.scss", ['sass']);
});

function bundleTypescript() {

  var bundle = function() {
    return browseifyBundler
          .bundle()
          .on('error', gutil.log.bind(gutil, 'Browserify Error'))
          .pipe(source('bundle.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          // Add transformation tasks to the pipeline here.
          .pipe(uglify())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('./public/js/'))
          .pipe(reload({stream:true}));
  };
  return bundle();
}
