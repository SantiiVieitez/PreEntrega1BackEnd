const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager.js');

const productManager = new ProductManager('products.json');


router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();

        if (limit !== undefined) {
            res.json({ products: products.slice(0, limit) });
        } else {
            res.render('home', { products });
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const product = await productManager.getProductById(id);

        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
        } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            
            console.error('Error de validación:', 'Todos los campos son obligatorios.');
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status: true, 
            stock,
            category,
            thumbnails:[],
        };

        const addedProduct = await productManager.addProduct(newProduct);

        res.status(201).json({ product: addedProduct });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
        } = req.body;

        
        if (!title || !description || !code || !price || !stock || !category) {
            console.error('Error de validación:', 'Todos los campos son obligatorios.');
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const updatedProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || [],
        };

        const result = await productManager.updateProduct(id,updatedProduct);
        
        if (result !== null) {
            res.status(200).json({ product: result });
        } else {
            console.error('Error al actualizar producto: Producto no encontrado con el ID', id);
            res.status(404).json({ error: 'Producto no encontrado con el ID especificado.' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto.' });
    }
});
router.delete('/:id',async (req, res) => {
    try {
        const id = req.params.id;
        await productManager.removeProduct(id);
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto.' });
    }
})
module.exports = router;