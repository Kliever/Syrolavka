import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'//Сжатие css файла
import webpcss from 'gulp-webpcss'//Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer'//Добавление вендорных префиксов
import groupMediaQueries from 'gulp-group-css-media-queries'//Группировка медиа запросов


const sass = gulpSass(dartSass);

export const scss = () => {
  return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "SCSS",
        message: "Error <%= error.message %>"
      })))
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({
      outputStyle: 'expanded' //стиль вывода (сжатый, несжатый и так далее)
    }))
    .pipe(
      app.plugins.if(
        app.isBuild,
        groupMediaQueries()
      )
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        webpcss({
          webpClass: ".webp",
          noWebpClass: ".no-webp"
        }))
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        autoprefixer({
          grid: true,
          overrideBrowserslist: ["last 3 versions"],
          cascade: true
        }))
    )
    //Раскомментировать, если нужен несжатый дубль файла стилей
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(              //сжатие стилей
      app.plugins.if(
        app.isBuild,
        cleanCss()
      )
    )
    .pipe(rename({
      extname: ".min.css" //переименование итогового файла
    }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browsersync.stream());
}