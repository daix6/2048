var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var path = require('path');
var del = require('del');
var http = require('http');
var st = require('st');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var deploying = false;

// Jade to html
gulp.task('jade', function() {
  return gulp.src('./src/jade/index.jade')
    .pipe($.if(deploying, $.jade(), $.jade({pretty: true})))
    .pipe(gulp.dest('./dist/'))
    .pipe($.livereload());
});

// less to css
gulp.task('less', function() {
  return gulp.src('./src/less/main.less')
    .pipe($.sourcemaps.init())
      .pipe($.less({
        paths: [path.join(__dirname, 'src', 'less', 'includes'),
                path.join(__dirname, 'src', 'less', 'components')]
      }))
      .pipe($.autoprefixer({
        browsers: ['last 4 versions']
      }))
      .pipe($.if(deploying, $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe($.livereload());
});

gulp.task('eslint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
    .on('error', $.util.log);
});

gulp.task('javascript', ['eslint'], function() {
  return browserify({
      entries: './src/js/app.js',
      debug: true
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init())
      .pipe($.if(deploying, $.uglify()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./dist/js'))
    .pipe($.livereload());
});

gulp.task('watch', function() {
  $.livereload.listen({ basePath: 'dist' });
  gulp.watch(['./src/jade/**/*.jade'], ['jade']);
  gulp.watch('./src/less/**/*.less', ['less']);
  gulp.watch('./src/js/**/*.js', ['javascript']);
});

gulp.task('clean', function() {
  return del([
    'dist/',
    '.publish/'
  ]);
});

gulp.task('build', ['jade', 'less', 'javascript']);

function server(done) {
  http.createServer(
    st({
      path: __dirname + '/dist',
      index: 'index.html',
      cache: false
    })
  ).listen(2048, done);
  console.log('listening on http://localhost:2048');
}

gulp.task('server', ['build'], server);

gulp.task('before-deploy', function() {
  deploying = true;
  return;
})

gulp.task('deploy', ['before-deploy', 'build'], function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages({
      branch: 'gh-pages'
    }));
});

gulp.task('default', ['server', 'watch']);
