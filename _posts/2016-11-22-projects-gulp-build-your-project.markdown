---
layout: post
title:  "使用gulp来构建你的web和h5项目"
date:   2016-11-22 8:0:0 +0800
categories: projects
---

# gulp
> 对项目的静态资源html、js、css、image压缩和打包的工具，可以对应替换html中css、js、image，css中image的路径。

# 主要依赖 
{% highlight ruby %}
{
   "name": "my-project",
   "version": "0.1.0",
   "devDependencies": {
     "dateformat": "^1.0.12",
     "del": "^2.2.2",
     "gulp": "^3.9.1",
     "gulp-cache": "^0.4.5",
     "gulp-concat": "^2.6.0",
     "gulp-html-minify": "0.0.14",
     "gulp-htmlmin": "^3.0.0",
     "gulp-imagemin": "^3.1.1",
     "gulp-md5-plus": "^0.2.5",
     "gulp-minify-css": "^1.2.4",
     "gulp-rename": "^1.2.2",
     "gulp-uglify": "^2.0.0"
   }
 }  
{% endhighlight %}  

# gulpfile.js 内容如下  
{% highlight ruby %}
// Include gulp
 var gulp = require('gulp');
 //del older files
 var del = require('del');
 gulp.task('clean', function (cb) {
     del([
         'build/*',
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
     return gulp.src('src/**/*.js')
         .pipe(uglify())
          .pipe( gulpMD5(32, 'build/**/*.html') )
         .pipe(gulp.dest('build/'));
 });
 // images
 var imagemin = require('gulp-imagemin');
 var cache = require('gulp-cache');
 gulp.task('images', ['html'], function() {
     return gulp.src('src/**/*.png')
         .pipe(imagemin({progressive: true }))
         .pipe( gulpMD5(32, 'build/**/*.css') )
         .pipe(gulp.dest('build/'));
 });
 
 // css
 // 获取 minify-css 模块（用于压缩 CSS）
 var minifyCSS = require('gulp-minify-css')
 // 压缩 css 文件
 // 在命令行使用 gulp css 启动此任务
 gulp.task('css', ['html'], function () {
     // 1. 找到文件
     return gulp.src('src/**/*.css')
     // 2. 压缩文件
         .pipe(minifyCSS())
         // 3. 另存为压缩文件
         .pipe( gulpMD5(32, 'build/**/*.html') )
         .pipe(gulp.dest('build'))
 })
 gulp.task('default', ['clean', 'images', 'css', 'scripts']);
{% endhighlight %}  


# 执行gulp 
{% highlight ruby %}
gulp-practise$ gulp
 [07:48:16] Using gulpfile /wwwroot/web_build/gulp-practise/gulpfile.js
 [07:48:16] Starting 'clean'...
 [07:48:16] Starting 'html'...
 [07:48:16] Finished 'html' after 43 ms
 [07:48:16] Starting 'images'...
 [07:48:16] Starting 'css'...
 [07:48:16] Starting 'scripts'...
 [07:48:17] Finished 'scripts' after 256 ms
 [07:48:17] Finished 'css' after 262 ms
 [07:48:17] gulp-imagemin: Minified 1 image (saved 0 B - 0%)
 [07:48:17] Finished 'images' after 369 ms
{% endhighlight %} 

# 项目github路径  
>[https://github.com/robertzhai/web_build/tree/master/gulp-practise](https://github.com/robertzhai/web_build/tree/master/gulp-practise)

# 扩展阅读  
>1. [http://www.gulpjs.com.cn/](http://www.gulpjs.com.cn/) 

