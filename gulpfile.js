var gulp = require('gulp'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    jpegtran = require('imagemin-jpegtran'),
    gifsicle = require('imagemin-gifsicle')
    reload = browserSync.reload;
  

/**********PATH*******************/
var path = {
  build: { //Folders for compiled files
    html: 'build/',
    js: 'build/js',
    css: 'build/css',
    img: 'build/img',
    fonts: 'build/fonts'
  },
  src: { //Folders for source files
    html: 'src/*.html',
    js: 'src/js/main.js',
    style: 'src/less/bootstrap.less',
    img: 'src/img/**/*.*', //For choose all type files and all folders
    fonts: 'src/fonts/**/*.*'
  },
  watch: { //Path for watched files
    html: 'src/**/*.html',
    js: 'src/js/*.js',
    style: 'src/less/**/*.less',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

/********WEBSERV & CONFIG**********/

var config = {        
  server: {
    baseDir:"./build" 
  },
  tunnel: false,
  host:'localhost',
  port:9000,
  logPrefix:"Johnny"
};

gulp.task('webserver', function(){
  browserSync(config);      //Run webserver with config
});
gulp.task('clean',function(cb){
  
})

/************BUILDS*******************/

//HTML
gulp.task('html', function(){
  gulp.src(path.src.html)
    .pipe(rigger())         //склеиватель из разных html в 1
    .pipe(gulp.dest(path.build.html)) //Writing file in a build
    .pipe(reload({stream:true})); //Reloading 'html' task on server
});
//CSS
gulp.task('style', function (done) {
  gulp.src(path.src.style)
     //при ошибках не выбрасывать из компилятора
    .pipe(sourcemaps.init())
    //gulp streams into fail-safe funtion for better error reporting
    .pipe(less().on('error',function(error){ //compilling
                    done(error);}))
    .pipe(autoprefixer('last 2 version', 
                        'safari 5', 
                        'ie 8', 
                        'ie 9', 
                        'opera 12.1', 
                        'ios 6', 
                        'android 4'
          ))
    .pipe(cssmin({showLog:true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./maps')) //setting up css sourcemaps
    .pipe(gulp.dest(path.build.css)) //Writing file in a build/css
    .on('end', function(){
          done()
      })
    .pipe(reload({stream:true})); //Reloading 'style' task on server
});
//IMG
gulp.task('img', function() {
  gulp.src(path.src.img)
    .pipe(imagemin({            //Setting up img minimizer
        progressive:true,
        svgoPlugins:[{removeViewBox:false}],
        use:[
          pngquant(),
          jpegtran(),
          gifsicle()
        ],
        interlaced:true
  }))
    
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});
//JS
gulp.task('js', function(){
  gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));    
});

/***********GLOBAL TASKS INIT**********/
gulp.task('build',[
          'html',
          'style',
          'img',
          'js'
]);

/************WATCH************/
gulp.task('watch',function () {   //если изменяем файл в src.html то 
                                  //запускается команда выполнения таска html
      watch([path.watch.html],function(event, cb){
        gulp.start('html');
        
  });
      watch([path.watch.style],function(event, cb){
        gulp.start('style');
  });
      watch([path.watch.img],function(event, cb){
        gulp.start('img');
   });     
      watch([path.watch.js],function(event, cb){
        gulp.start('js');
   });     
});

gulp.task('default',['build','webserver','watch']); //Building project


