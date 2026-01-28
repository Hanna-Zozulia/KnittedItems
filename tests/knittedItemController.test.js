// Import controller functions to be tested
const { getAllKnittedItems, getKnittedItemById, getAbout } = require('../controllers/knittedItemController');
// Import the model to mock it
const KnittedItem = require('../models/product');

// Mock the KnittedItem model
jest.mock('../models/product');

// Test suite for knittedItemController
describe('knittedItemController', () => {

  // Common mock for request and response objects
  let req, res;

  // Before each test, reset the mock objects
  beforeEach(() => {
    req = {
      params: {},
      get: jest.fn(),
    };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  // Test suite for getAllKnittedItems function
  describe('getAllKnittedItems', () => {
    // Test case for successfully fetching all items
    it('should render the products page with all knitted items', async () => {
      // Mock data for knitted items
      const mockItems = [
        { id: 1, name: 'Scarf', price: 25.00 },
        { id: 2, name: 'Rug', price: 70.00 },
      ];
      // Mock the findAll method to return the mock data
      KnittedItem.findAll.mockResolvedValue(mockItems);

      // Call the controller function
      await getAllKnittedItems(req, res);

      // Assert that render was called with the correct view and data
      expect(res.render).toHaveBeenCalledWith('products', {
        pageTitle: 'Все товары',
        knittedItems: mockItems,
        path: '/',
      });
    });

    // Test case for a database error
    it('should handle errors and send a 500 status', async () => {
      // Mock the findAll method to reject with an error
      KnittedItem.findAll.mockRejectedValue(new Error('Database error'));

      // Call the controller function
      await getAllKnittedItems(req, res);

      // Assert that status was called with 500 and send was called with an error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Ошибка сервера');
    });
  });

  // Test suite for getKnittedItemById function
  describe('getKnittedItemById', () => {
    // Test case for successfully fetching an item by its ID
    it('should render the product detail page for a valid ID', async () => {
      // Mock data for a single knitted item
      const mockItem = { id: 1, name: 'Scarf', price: 25.00 };
      req.params.id = '1';
      // Mock the findByPk method to return the mock item
      KnittedItem.findByPk.mockResolvedValue(mockItem);
      // Mock the get method for the 'Referer' header
      req.get.mockReturnValue('/products');

      // Call the controller function
      await getKnittedItemById(req, res);

      // Assert that render was called with the correct view and data
      expect(res.render).toHaveBeenCalledWith('product-detail', {
        pageTitle: mockItem.name,
        knittedItem: mockItem,
        path: `/products/${mockItem.id}`,
        previousPage: '/products',
      });
    });

    // Test case for when an item is not found
    it('should return a 404 status if the item is not found', async () => {
      req.params.id = '999';
      // Mock the findByPk method to return null
      KnittedItem.findByPk.mockResolvedValue(null);

      // Call the controller function
      await getKnittedItemById(req, res);

      // Assert that status was called with 404 and render was called with the 404 view
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.render).toHaveBeenCalledWith('404', { pageTitle: 'Товар не найдден' });
    });

    // Test case for a database error
    it('should handle errors and send a 500 status', async () => {
      req.params.id = '1';
      // Mock the findByPk method to reject with an error
      KnittedItem.findByPk.mockRejectedValue(new Error('Database error'));

      // Call the controller function
      await getKnittedItemById(req, res);

      // Assert that status was called with 500 and send was called with an error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Ошибка сервера');
    });
  });

  // Test suite for getAbout function
  describe('getAbout', () => {
    // Test case for successfully rendering the about page
    it('should render the about page with top items', async () => {
      // Mock data for categories and top items
      const mockCategories = [{ category: 'Rugs' }, { category: 'Scarfs' }];
      const mockTopItems = [
        { id: 1, name: 'Best Rug', category: 'Rugs', createdAt: new Date() },
        { id: 2, name: 'Warm Scarf', category: 'Scarfs', createdAt: new Date() },
      ];
      // Mock findAll for categories
      KnittedItem.findAll.mockResolvedValue(mockCategories);
      // Mock findOne to return top items for each category
      KnittedItem.findOne
        .mockResolvedValueOnce(mockTopItems[0])
        .mockResolvedValueOnce(mockTopItems[1]);
      
      // Call the controller function
      await getAbout(req, res);
      
      // Assert that render was called with the correct view and data
      expect(res.render).toHaveBeenCalledWith('about', {
        pageTitle: 'О нас | ShopTime',
        path: '/about',
        topItems: mockTopItems,
      });
    });

    // Test case for a database error
    it('should handle errors and send a 500 status', async () => {
        // Mock findAll to reject with an error
        KnittedItem.findAll.mockRejectedValue(new Error('Database error'));

        // Call the controller function
        await getAbout(req, res);

        // Assert that status was called with 500 and send was called with an error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Ошибка сервера');
    });
  });
});
