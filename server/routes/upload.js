const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
//Importaciones de Moongose
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));



app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    //Validamos que tengamos archivos a subir

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // validamos el tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: { message: `El tipo: ${tipo}no es valido` },
                tiposValidos: tiposValidos.join(', ')
            })

    }






    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    // Buscamos la extension del archivo
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // restringimos los archivos que podemos subir
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: { message: `la extension ${extension} no puede adjuntarse` },
                extensionesValidas
            })
    }

    // vamos a generar el nombre del archivo para evitar duplicidades
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, err => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        // Aqui ya tenemos la imagen cargada en el Filesystem
        // en funcion del tipo de imagen recorremos un camino distinto
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else if (tipo === 'productos') {
            console.log('en ruta');
            imagenProducto(id, res, nombreArchivo)
        }
    });
});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDb) => {

        if (err) {

            // debo borrar la imagen que he movido a uploads
            borraArchivo(nombreArchivo, 'usuarios');

            return
            res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!usuarioDb) {

            // debo borrar la imagen que he movido a uploads
            borraArchivo(nombreArchivo, 'usuarios');

            return
            res.status(500)
                .json({
                    ok: false,
                    err: { message: 'El usuario no existe' }
                });
        }




        borraArchivo(usuarioDb.img, 'usuarios');

        // vamos a grabar en mongo el nombre del archivo que he movido a uploads ultima version de la imagen
        usuarioDb.img = nombreArchivo;
        usuarioDb.save((err, UsuarioDb) => {

            res.json({
                ok: true,
                usuario: usuarioDb,
                img: nombreArchivo

            });
        });


    });



}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDb) => {

        if (err) {
            // borramos el archivo
            borraArchivo(nombreArchivo, 'productos')
                // enviamos una respuesta
            return res.status(500)
                .json({
                    ok: false,
                    err
                })

        }

        if (!productoDb) {
            // borramos el archivo 
            borraArchivo(nombreArchivo, 'productos')
                // enviamos una respuesta
            return res.status(400)
                .json({
                    ok: false,
                    err: { message: 'No existe el producto indicado' }

                })
        }
        // si todo es ok borro la imagen anterior de /upload si la hubiera
        borraArchivo(productoDb.img, 'productos')

        productoDb.img = nombreArchivo
        productoDb.save((err, productoDb) => {

            return res.status(200)
                .json({
                    ok: true,
                    producto: productoDb,
                    img: nombreArchivo

                })

        })



    })



}

function borraArchivo(nombreImagen, tipo) {

    // una vez que identifico el usuario, voy a ver si ya tenia una imagen anterior
    // creo el path que tendria en el caso de que existiera
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //confirmar si ese path que he creado con el nombre del archivo de mongo existe en fs
    // si existe lo borro porque he movido un nuevo archivo
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;