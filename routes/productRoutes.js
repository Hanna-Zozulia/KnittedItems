//Импортируем модуль express
const express = require('express');
//Импортируем контролер для товаров
const knittedItemController = require('../controllers/knittedItemController');

// --- ОПРЕДЕЛЕНИЕ МАРШРУТОВ ---

//Создаем экземпляр Router из Express
//Router позволяет группировать обработчики маршрутов и использовать их в основном приложении
const router = express.Router();

//Маршрут для главной страницы ("/")
//При GEt-запросе на этот URL будет вызвана функция getAllProducts из productController
//Эта страница будет отображать список всех товаров
router.get('/', knittedItemController.getAllKnittedItems);

//Маршрут для страницы со списком всех товаров ('/products')
//Он также ведет на тот же обработчик, что и главная страница
router.get('/products', knittedItemController.getAllKnittedItems);

//Маршрут для детальной страницы товара
//':id' - это динамический параметрю Express поместит значение из URL (например, '1' из '/products/1')
//в req.params.id, которое мы затем используем в контроллере для поиска товара.
router.get('/products/:id', knittedItemController.getKnittedItemById);

//Маршрут для страницы о нас
router.get('/about', knittedItemController.getAbout);

//Экспортируем router, чтобы его можно было подключить в основном файле приложения (app.js)
module.exports = router;