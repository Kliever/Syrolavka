import replace from "gulp-replace"; //Поиск и замена
import plumber from "gulp-plumber"; //Обработкаошибок
import notify from "gulp-notify"; //Сообщения (подсказки)
import browsersync from "browser-sync"; //Локальныйсервер
import newer from "gulp-newer"; //Проверка обновления картинок
import ifPlugin from "gulp-if"; //Условное ветвление

//Экспорт объекта
export const plugins = {
    replace: replace,
    plumber: plumber,
    notify: notify,
    browsersync: browsersync,
    newer: newer,
    if: ifPlugin
}