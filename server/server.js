require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    // rutas de usuario a nuestro maestro de rutas
app.use(require('./routes/index'));

// Habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));





// Conexion a la base de dato          
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online');

});

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto: ${process.env.PORT}`);
})