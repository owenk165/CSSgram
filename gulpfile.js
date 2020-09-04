var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cssmin      = require('gulp-clean-css'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    cache       = require('gulp-cached'),
    prefix      = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    size        = require('gulp-size'),
    imagemin    = require('gulp-imagemin'),
    minifyHTML  = require('gulp-htmlmin'),
    pngquant    = require('imagemin-pngquant'),
    plumber     = require('gulp-plumber'),
    deploy      = require('gulp-gh-pages'),
    notify      = require('gulp-notify'),
    sassLint    = require('gulp-sass-lint'),
    twig        = require('gulp-twig');


gulp.task('lib-scss', gulp.series(function() {
    var onError = function(err) {
      notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
      })(err);
      this.emit('end');
  };

  return gulp.src('source/scss/**/*.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(prefix())
    .pipe(gulp.dest('source/css'))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('source/css'))
    .pipe(gulp.dest('site/css'))
    .pipe(reload({stream:true}));
}));

gulp.task('site-scss', gulp.series(function() {
    var onError = function(err) {
      notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
      })(err);
      this.emit('end');
  };

  return gulp.src('site/scss/**/*.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(prefix())
    .pipe(gulp.dest('site/css'))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('site/css'))
    .pipe(reload({stream:true}));
}));

gulp.task('browser-sync', gulp.series(function() {
    browserSync({
        server: {
            baseDir: "site"
        }
    });
}));

gulp.task('deploy', gulp.series(function () {
    return gulp.src('site/**/*')
        .pipe(deploy());
}));

gulp.task('sass-lint', gulp.series(function () {
  gulp.src('scss/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}));

gulp.task('twig', gulp.series(function () {
  gulp.src(['site/**/*.twig', "!site/twig/template.twig"], {base: './'})
    .pipe(twig({
      data: require('./site/filters.json')
    }))
    .pipe(gulp.dest('./'));
}));


gulp.task('watch', gulp.series(function() {
  gulp.watch('source/scss/**/*.scss', ['lib-scss', 'site-scss', 'sass-lint']);
  gulp.watch('site/scss/**/*.scss', ['site-scss', 'sass-lint']);
  gulp.watch('source/scss/**/*.html', ['minify-html']);
  gulp.watch('site/**/*.twig', ['twig']);
}));


gulp.task('jshint', gulp.series(function() {
  gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}));

gulp.task('default', gulp.series(['browser-sync', 'twig', 'lib-scss', 'site-scss', 'watch']));