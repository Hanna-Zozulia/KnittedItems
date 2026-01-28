//Подключаем модуль для работы с переменными окружениями
require('dotenv').config();

//Импортируем Sequelize
const {Sequelize} = require ('sequelize');

// ---- НАСТРОЙКА ПОДКЛЮЧЕНИЯ SEQUELIZE --

//Cjplftv yjdsq 'rptvgkzh Sequelize, передавая ему параметры подключения
//Эти параметры считываються из файла .env, что безопастно и удобно
const sequelize = new Sequelize (
    process.env.DB_NAME, //Имя базы данных
    process.env.DB_USER, //Имя пользователя
    process.env.DB_PASSWORD, //Пароль
    {
        host: process.env.DB_HOST, //Хост базы данных
        dialect: process.env.DB_DIALECT, //Тип используемой СУБД (в нашем случае 'mysql')
        //Опционально: можно отключить логирование каждого SQL-запроса в консоль
        logging: false
    }
);

//Экспортируем созданный экземпляр sequelize, чтобы использовать его в других частях приложения
//Например, в app.js для синхронизации и в моделях для определения таблиц
module.exports = sequelize;
