const { get } = require('http');

const fs = require('fs').promises;

class ProductManager {
    constructor(Path) {
        this.Path = Path;
        this.products = [];
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.Path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            let products = await this.getProducts();
            let productIndex = products.findIndex(p => p.id && p.id.toString() === id.toString());
    
            if (productIndex !== -1) {
                for (const key in updatedProduct) {
                    if (updatedProduct.hasOwnProperty(key)) {
                        products[productIndex][key] = updatedProduct[key];
                    }
                }
    
                await this.saveProducts(products);
                return products[productIndex];
            } else {
                return null; // Producto no encontrado
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            return null;
        }
    }


    async saveProducts(products) {
        // Guardar el arreglo de productos en el archivo
        await fs.writeFile(this.Path, JSON.stringify(products, null, 2), 'utf8');
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
        product.id = newProductId;
        products.push(product);
    
        await this.saveProducts(products);
    
        return product;
    }

    async removeProduct(id) {
        // Leer productos existentes
        const products = await this.getProducts();
        // Filtrar productos para excluir el que tiene el ID especificado
        const filteredProducts = products.filter(product => product.id && product.id.toString() !== id.toString());
        await this.saveProducts(filteredProducts);
        this.products = filteredProducts;
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();

            if (!products) {
                console.error('Error: El archivo products.json está vacío o no es válido.');
                return null;
            }
    
            const product = products.find(p => p.id && p.id.toString() === id.toString());
    
            if (!product) {
                console.error('Error: Producto no encontrado con el ID', id);
                return null;
            }
    
            return product;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return null;
        }
    }
}
module.exports = ProductManager;