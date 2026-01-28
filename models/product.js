//Импортируем необходимые типы данных из Sequelize
const {DataTypes} = require('sequelize');
//Импортируем экземпляр sequelize, который мы настроили в config/database.js
const sequelize = require('../config/database');

//---ОПРЕДЕЛЕНИЕ МОДЕЛИ "PRODUCT" ---

//Модель в Sequelize - это абстракция, которая представляет таблицу в вашей базе данных.
//Здесь мы определяем модель 'Product', которая будет соответствовать таблице 'products'.

const KnittedItem = sequelize.define('KnittedItem', {
    //Sequelize автоматически создаст поле 'id' как первичный ключ (PRIMARY KEY) с автоинкрементом, поэтому его можно не определять явно.

    //Поле 'name' (название товаров)
    name: {
        type: DataTypes.STRING, //Тип данных - строка
        allowNull: false //Поле не может быть пустым (эквивалент NOT NULL в SQL)
    },

    //Поле 'description' (описание товара)
    description: {
        type: DataTypes.TEXT, //Тип данных - текст (для длинных описаний)
        allowNull: true //Поле может быть пустым
    },

    //Поле 'price' (цена товара)
    price: {
        type: DataTypes.DECIMAL(10, 2), //Тип данных - десятичное число (10 знаков всего, 2 после запятой)
        allowNull: false //Поле может быть пустым
    },

    //Поле 'category' (категория товара)
    category: {
        type: DataTypes.STRING, 
        allowNull: true 
    },

    //Поле для хранения URL изображения товара
    imageUrl: {
        type: DataTypes.STRING, 
        allowNull: true //Поле может быть пустым
    },

    //Поле для хранения размера
    size: {
        type: DataTypes.STRING, 
        allowNull: true 
    }

    //Sequelize также автоматически добавляет поля 'createdAt' и 'updatedAt', чтобы отслеживать время создания и последнего обновления записи.
});

//Экспортируем модель Product, чтобы её можно было использовать в других частях приложения, например, в контроллерах для выполнения запросов к тоблице товаров.
module.exports = KnittedItem;