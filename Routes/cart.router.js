const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager.js');

const cartManager = new CartManager('carritos.json');

router.post('/', (req, res) => {
    const products = req.body.products || [];
    const newCart = cartManager.createCart(products);
    res.status(201).json(newCart);
  });

  router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const cart = await cartManager.getCartById(id);

        if (cart) {
            res.json({ cart });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ error: 'Error al obtener carritos' });
    }
});
  

router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const cartId = parseInt(req.params.cid);
      const productId = parseInt(req.params.pid);
      const quantity = parseInt(req.body.quantity) || 1;
  
      const cart = await cartManager.getOrCreateCart(cartId);
      
      const existingProduct = cart.Products.find(product => product.id === productId);
      
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.Products.push({ id: productId, quantity });
      }
  
      await cartManager.saveCarts();
  
      return res.json(cart);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Error del servidor' });
    }
  });


  module.exports = router;