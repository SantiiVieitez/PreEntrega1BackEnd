const express = require('express');
const app = express();
const path = require('path');
const ProductosRouter = require('./Routes/products.router.js');
const cartRouter = require('./Routes/cart.router.js');

const port = 8080;
app.use(express.json())

app.use("/api/productos", ProductosRouter)
app.use("/", ProductosRouter)
app.use("/:pid", ProductosRouter)
app.use('/api/carts',cartRouter);



//regla
app.get('/ping', (req, res) =>{
    res.send('pong')
})

app.listen(port, () => {
    console.log(`Funcionando en puerto: ${port}`);
    console.log('Ruta del archivo JSON:', path.resolve('../products.json'));
});