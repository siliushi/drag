var gulp = require('gulp'),
	concat = require("gulp-concat"),
	clean = require("gulp-clean"),
	uglify = require("gulp-uglify"),
	rename = require('gulp-rename');

// 清除amaze.min.js
gulp.task("cleand", function(){
  return gulp.src(['../drag.min.js'], {read: false}).pipe(clean({force:true}));
});

// 压缩
gulp.task("default", ["cleand"], function() {
	return gulp.src("../src/drag.js")
		.pipe(uglify({
			mangle: false
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest("../"));
});
