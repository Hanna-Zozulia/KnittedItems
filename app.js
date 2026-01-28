// Импортируем необходимые модули
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); //Используем mysql2/promise для async/await
require('dotenv').config();

const sequelize = require('./config/database'); //Настройка подключения Sequelize
const productRoutes = require('./routes/productRoutes'); //Маршруты для товаров
const KnittedItem = require('./models/product'); //Модель товара

// ФУНКЦИЯ ДЛЯ ИНИЦИАЛИЗАЦИИ БАЗЫ ДАННЫХ
async function initializeDatabase() {
    try {
        //Устанавливаем соединение с MySQL сервером БЕЗ указания конкретной базы данных
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        //Выполняем SQL-запрос для создания базы данных, если она не существует
        await connection.query(`CREATE DATABASE IF NOT EXISTS
            ${process.env.DB_NAME}
            ;`);
            console.log('База данных успешно проверена/создана.');
            // Закрываем соединение
            await connection.end();        
    } catch (error) {
        // Ловим ошибку, если не удалось подключиться к MySQL или создать БД
        console.error('Ошибка при инициализации базы данных', error);
        // Завершаем процесс, так как без БД приложение работать не сможет
        process.exit(1);
    }
}

// ОСНОВНАЯ НАСТРОЙКА ПРИЛОЖЕНИЯ 
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

// ПРОМЕЖУТОЧНЫЙ ОБРАБОТЧИК (MIDDLEWARE)
app.use(express.static(path.join(__dirname, 'public')));

// МАРШРУТИЗАЦИЯ
app.use(productRoutes);

// ---ГЛАВНАЯ ФУНКЦИЯ ЗАПУСКА ---
async function startApp() {
    //Шаг 1: Убедиться, что база данных существует
    await initializeDatabase();

    // Шаг2: Синхронизировать модели и запустить сервер
    const PORT = process.env.PORT || 3000;
    sequelize.sync({force: true})
    .then(async () => {
        console.log('Таблицы успешно синхронизированы (или пересозданы).');

        // Шаг3: Заполнение данными (seeding)
        const count = await KnittedItem.count();
        if (count === 0) {
            console.log('Таблица товаров пуста. Заполняем тестовыми данными...');
            await KnittedItem.bulkCreate([
                {
                    name: 'Плед',
                    description: 'Тёплый и мягкий плед, чтобы уютно расслабиться после долгого дня. Идеально подходит для дома.',
                    price: 90,
                    category: 'Пледы',
                    imageUrl: '/img/pled1.jpg',
                    size: '90 x 90'
                },
                {
                    name: 'Вязаный шарф',
                    description: 'Стильный и тёплый шарф ручной работы. Добавляет уют и шарм любому образу.',
                    price: 20,
                    category: 'Аксессуары',
                    imageUrl: '/img/scarf.jpg',
                    size: '20 x 120'
                },
                {
                    name: 'Вязаный коврик',
                    description: 'Мягкий коврик ручной работы для дома. Добавляет комфорта и уюта в любое помещение.',
                    price: 120,
                    category: 'Декор',
                    imageUrl: '/img/rug.jpg',
                    size: '120 x 80'
                },
                {
                    name: 'Мягкий плед для дивана',
                    description: 'Тёплый плед из высококачественной пряжи. Отлично подходит для дивана или кресла.',
                    price: 150,
                    category: 'Пледы',
                    imageUrl: '/img/soft_pled.jpg',
                    size: '200 x 160'
                }
            ]);
            console.log('тестовые данные успешно добавленны.');
        }

        // Шаг 4: Запуск сервера
        app.listen(PORT, () => {
            console.log(`Сервер запушен на порту ${PORT}. Откройте http://localhost:${PORT}`);
        });
    }) 
    .catch(err => {
        console.error('Ошибка при синхронизации таблиц: ', err);
    });
}

// Запуск приложения
startApp();