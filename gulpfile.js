"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function () {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("style_full", function () {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build-clear/css"));
});

gulp.task("html", function () {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
})

gulp.task("html_full", function () {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build-clear"));
})

gulp.task("images", function () {
  return gulp.src("img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("image/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/image"));
});

gulp.task("svgstore", function () {
  return gulp.src("image/**/*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/image"));
});

gulp.task("copy", function () {
  return gulp.src([
    "fonts/**/*.{woff, woff2}",
    "img/**",
    "js/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
})

gulp.task("copy_clear", function () {
  return gulp.src([
    "fonts/**/*.{woff, woff2}",
    "image/**",
    "js/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build-clear"));
})

gulp.task("clean", function () {
  return del("build");
})

// gulp.task("serve", function () {
//   server.init({
//     server: "build/"
//   });
//   gulp.watch("sass/**/*.scss", ["style"]);
//   gulp.watch("*.html").on("change", server.reload)
// });

gulp.task("serve", function () {
  server.init({
    server: "build/"
  });
  gulp.watch("sass/**/*.scss", ["style"]);
  gulp.watch("*.html", ["html"]);
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "html",
    done
  );
})


gulp.task("create-build", function () {
  run(
    "copy_clear",
    "style_full",
    "html_full"
  );
})

gulp.task("delete-build", function () {
  return del("build-clear");
})
