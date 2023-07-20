//COMMON VARIABLES

const { src, dest, watch, parallel, series } = require("gulp");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

//IMAGES

const newer = require("gulp-newer");

const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");

function images() {
  return src(["app/images/src/*.*", "!app/images/src/*.svg"])
    .pipe(newer("app/images"))
    .pipe(avif({ quality: 50 }))

    .pipe(src("app/images/src/*.*"))
    .pipe(newer("app/images"))
    .pipe(webp())

    .pipe(src("app/images/src/*.*"))
    .pipe(newer("app/images"))
    .pipe(imagemin())

    .pipe(dest("app/images"));
}
exports.images = images;

//STYLES

const autoprefixer = require("gulp-autoprefixer");
const scss = require("gulp-sass")(require("sass"));

function styles() {
  return src("app/scss/style.scss")
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] }))
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

exports.styles = styles;

//JS

const uglify = require("gulp-uglify-es").default;

function scripts() {
  return src(["app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

exports.scripts = scripts;

//WATCHING

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
  watch(["app/images/src"], images);
  watch(
    ["app/scss/style.scss", "app/scss/components/*.*", "app/scss/*.*"],
    styles
  );
  watch(["app/js/main.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

exports.watching = watching;

//BUILD + CLEAN

const clean = require("gulp-clean");

function building() {
  return src(
    [
      "app/css/style.min.css",
      "app/js/main.min.js",
      "app/images/*.*",
      "app/**/*.html",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

function cleanDist() {
  return src("dist").pipe(clean());
}

exports.build = series(cleanDist, building);

exports.default = parallel(styles, scripts, watching);
