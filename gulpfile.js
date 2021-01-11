var gulp = require('gulp');
var browserify = require('browserify');
var log = require('gulplog');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
const rename = require('gulp-rename');
var tsify = require('tsify');


gulp.task('build', function () {
    var tsRoot = 'wwwroot/js/';
    return gulp.src(tsRoot + '**/_app.ts', { read: false  }) // no need of reading file because browserify does.
        // transform file objects using gulp-tap plugin
        .pipe(tap(function (file) {

            log.info('bundling ' + file.path);
            
            // replace file contents with browserify's bundle stream
            file.contents =
                browserify(file.path, { debug: true })
                .plugin(tsify, {})
                    .bundle();
        }))

        // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
        .pipe(buffer())

        // load and init sourcemaps
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
    
        .pipe(sourcemaps.mapSources(function (sourcePath, file) {
            var base = file.dirname.slice(file.base.length + 1);
            log.info('sp- ' + sourcePath);
            log.info('b- ' + base);

            var path = sourcePath.slice(base.length + 1);
            if (path.startsWith(tsRoot)) {
                return path.slice(tsRoot.length);
            }
            return sourcePath;
        }))
        .pipe(rename({ extname: '.js' }))
        .pipe(sourcemaps.write('./', { sourceRoot: '../' }))

        .pipe(gulp.dest('./wwwroot/js/output'));
        log.info(gulp.src)
});