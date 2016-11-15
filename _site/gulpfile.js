// Include gulp

function getDate() {
 	var dateFormat = require('dateformat');
	var now = new Date();
 	return dateFormat(now, "yyyyhhMMss");
 }
var date = getDate();
var gulp = require('gulp');


//del older files
var del = require('del');
gulp.task('clean', function (cb) {
  del([
    'build/js',
    'build/css',
    'build/img',
    // 'build/mobile/**/*',
    // 我们不希望删掉这个文件，所以我们取反这个匹配模式
    // '!dist/mobile/deploy.json'
  ], cb);
});

//js
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpMD5 = require('gulp-md5-plus');

//html http://kangax.github.io/html-minifier/
//html https://github.com/kangax/html-minifier
// var htmlminify = require("gulp-html-minify");
var htmlminify = require("gulp-htmlmin");
gulp.task('html' , function(){
    return gulp.src("src/**/*.html")
        .pipe(htmlminify({ignoreCustomComments: '[ /^<!/ ]',
            collapseWhitespace: true,
            preserveLineBreaks:false,
            processConditionalComments:true}))
        .pipe(gulp.dest("build"))
});

gulp.task('scripts', ['html'], function() {
// gulp.task('scripts', function() {
    return gulp.src('src/js/**/*')
      // .pipe(concat('main.js'))
      // .pipe(rename({suffix:  '.' + date + '.min'}))
        .pipe(uglify())
        .pipe( gulpMD5(32, 'build/*.html') )
      .pipe(gulp.dest('build/js'));
});
// images 
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(rename({suffix:  '.' + date}))
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/img'));
});

// css
// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css')
// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', ['html'], function () {
    // 1. 找到文件
    return gulp.src('src/css/**/*')
    // .pipe(rename({suffix:  '.' + date + '.min'}))
    // 2. 压缩文件
      .pipe(minifyCSS())
    // 3. 另存为压缩文件
        .pipe( gulpMD5(32, 'build/*.html') )
        .pipe(gulp.dest('build/css'))
})


//watch
gulp.task('watch', function() {
   // Watch .js files
  gulp.watch('src/js/**/*', ['scripts']);
   // Watch image files
  gulp.watch('src/img/**/*', ['images']);
  // Watch css files
  gulp.watch('src/css/**/*', ['css']);
  // gulp.watch('src/**/*', ['html']);
 });

// Default Task
// gulp.task('default', ['clean']);
// gulp.task('default', ['clean', 'scripts', 'images', 'css', 'html', 'watch']);
gulp.task('default', ['clean', 'scripts', 'images', 'css']);








