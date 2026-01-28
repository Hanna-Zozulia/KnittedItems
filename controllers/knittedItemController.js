//Импортируем модель Product, чтобы иметь возможность работать с таблицей товаров в БД
const KnittedItem = require('../models/product');

// ---КОНТРОЛЕР ДЛЯ РАБОТЫ С ТОВАРАМИ ---

//Контролерр - это объект или модель , который содержит логику обработки запросов. 
//Он выступает посредником между маршрутами (routers) и моделями (models).

//Функция (действие) для получения и отображения всех товаров
const getAllKnittedItems = async (req, res) => {
    try {
        //Используем метод findAll() из Sequelize для получения всех записей из таблицы 'products
        const knittedItems = await KnittedItem.findAll();

        //res.render() - это метод Express для отрисовки шаблона представления.
        //Первым аргументом мы передаем имя файла шаблона ('products.js' в папке 'views).
        //Вторым аргументом - объект с данными, которые будут доступны внутри шаблона.
        res.render('products', {
            pageTitle: 'Все товары', //Передаем заголовок сораницы
            knittedItems: knittedItems, //Передаем массив товаров
            path: '/' //Передаем текущий путь для навигации
        }) ;

    } catch (error) {
        //В случае ошибки в процессе получения данных, выводим ее в консоль
        console.error('Ошибка при получении товаров: ', error);
        //Можно также отправить страницу с ошибкой
        res.status(500).send('Ошибка сервера');
    }
};

// Функция (действие) для получения и отображения одного товара по его ID
const getKnittedItemById = async(req, res) => {
    try {
        //Получаем ID товара из параметров URL (например, из /products/1)
        const knittedItemId = req.params.id;

        //Используем метод findByPk() (найти по первичному ключу) для поиска товара
        const knittedItem = await KnittedItem.findByPk(knittedItemId);

        //Если товар не найден, отправляем страницу 404 (не найдено)
        if(!knittedItem) {
            return res.status(404).render('404', {pageTitle: 'Товар не найдден'});
        }

        // Получаем предыдущую страницу из заголовков запроса
        const previousPage = req.get('Referer') || '/';

        //Если товар не найден, отрисовываем шаблон 'product/detail.ejs' и передаем в него данные найденного товара 
        res.render('product-detail', {
            pageTitle: knittedItem.name, //Заголовок страницы - название товара
            knittedItem, //Передаем объект товара
            path: `/products/${knittedItem.id}`, // Передаем путь для навигации
            previousPage // передаем предыдущую страницу 
        });
    } catch (error) {
        //Обработка товаров
        console.error('Ошибка при получении товаров: ', error);
        res.status(500).send('Ошибка сервера');
    }
};

// Добавляем страницу о нас
const getAbout = async (req, res) => {
    try { 
        // Получаем все уникальные категории
        const categories = await KnittedItem.findAll({
        attributes: ['category'],
        group: ['category']
        });

        const topItems = [];

        // Для каждой категории берем один лучший товар (например, самый новый)
        for (const cat of categories) {
        const item = await KnittedItem.findOne({
            where: { category: cat.category },
            order: [['createdAt', 'DESC']] // лучший = последний добавленный
        });
        if (item) topItems.push(item);
        }

        res.render('about', {
            pageTitle: 'О нас | ShopTime',
            path: '/about',
            topItems
        });

  } catch (error) {
    console.error('Ошибка при загрузке страницы:', error);
    res.status(500).send('Ошибка сервера');
  }
};


//Экспортируем функции контроллера, чтобы их можно было использовать в файлах маршрутизации
module.exports = {
    getAllKnittedItems,
    getKnittedItemById, 
    getAbout
};