const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const ProductosRouter = require('./Routes/products.router.js');
const cartRouter = require('./Routes/cart.router.js');

const port = 8080;
app.use(express.json())
app.engine('handlebars', exphbs({ /* configuraciones opcionales */ }));
app.set('view engine', 'handlebars');
const server = http.createServer(app);
const io = socketIO(server);


app.set('views', path.join(__dirname, 'views'));

app.use("/api/productos", ProductosRouter)
app.use("/", ProductosRouter)
app.use("/:pid", ProductosRouter)
app.use('/',cartRouter);



//regla
app.get('/ping', (req, res) =>{
    res.send('pong')
})

app.listen(port, () => {
    console.log(`Funcionando en puerto: ${port}`);
    console.log('Ruta del archivo JSON:', path.resolve('../products.json'));
});