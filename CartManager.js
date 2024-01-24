const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.filePath = 'carritos.json';
    this.init();
  }

  async init() {
    try {
      this.carts = await this.loadCarts();
    } catch (error) {
      console.error('Error al cargar carritos:', error.message);
      this.carts = []; 
    }
  }

  async createCart(products = []) {
    const newCart = {
      id: this.carts.length > 0 ? Math.max(...this.carts.map(p => p.id)) + 1 : 1,
      Products: products,
    };

    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      
      if (!data.trim()) {
        // El archivo está vacío, devuelve un array vacío.
        return [];
      }

      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error al cargar carritos:', error.message);
      throw error; // Re-lanza el error para que pueda ser manejado por otros.
    }
  }

  async saveCarts() {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      await fs.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      console.error('Error al guardar carritos:', error.message);
      throw error; // Re-lanza el error para que pueda ser manejado por otros.
    }
  }
  async getOrCreateCart(cartId) {
    try {
      const carts = await this.loadCarts();
      let cart = carts.find(cart => cart.id === cartId);

      if (!cart) {
        // Si no se encuentra el carrito, crear uno nuevo
        cart = {
          id: cartId,
          Products: [],
        };
        carts.push(cart);
        await this.saveCarts();
      }

      return cart;
    } catch (error) {
      console.error('Error al obtener o crear carrito:', error.message);
      throw error;
    }
  }

  async getCartById(id) {
    try {
        const carts = await this.loadCarts();

        if (!carts) {
            console.error('Error: El archivo carritos.json está vacío o no es válido.');
            return null;
        }

        const cart = carts.find(p => p.id && p.id.toString() === id.toString());

        if (!product) {
            console.error('Error: Cart no encontrado con el ID', id);
            return null;
        }

        return cart;
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        return null;
  }
}
}


module.exports = CartManager;