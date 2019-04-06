const express = require('express');


const { verificaToken } = require('../middlewares/autenticacion');

let Producto = require('../models/producto');
const _ = require('underscore')

app = express();



//======================
//Obtener todos los productos
//======================

app.get('/producto', verificaToken, (req, res) => {

    // paginacion
    let desde = req.query.desde || 0;
    desde = parseInt(desde);
    let limite = req.query.limite || 5;
    limite = parseInt(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .exec((err, productosDb) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                productosDb

            })

        })






})


//===========================
//Obtener un producto por id 
//===========================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findOne({ _id: id })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .exec((err, productoDb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!productoDb) {

                return res.status(400).json({
                    ok: false,
                    message: 'No existe el producto, vuelva a intentarlo'
                })
            }

            res.json({
                ok: true,
                producto: productoDb
            })

        })






})



//=======================
//Crear un nuevo producto
//=======================
// grabar el usuario
// grabar una categoria
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body
    body.usuario = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario

    })

    // grabamos
    producto.save((err, productoDb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        if (!productoDb) {

            return res.status(400).json({
                ok: false,
                message: 'El producto no se grabo'

            });
        }

        res.json({
            ok: true,
            categoria: productoDb
        });




    })


})

//=======================
//Actualizar  producto
//=======================

app.put('/producto/:id', verificaToken, (req, res) => {

    let body = _.pick(req.body, ['nombre', 'disponible', 'descripcion', 'categoria'])


    let id = req.params.id

    Producto.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, productoDb) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productoDb) {

            return res.status(400).json({
                ok: false,
                message: 'No existe el producto solicitado'

            })

        }

        res.json({
            ok: true,
            producto: productoDb
        })




    })

})

//=======================
//Borrar  producto
//=======================

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findOneAndUpdate({ _id: id, disponible: true }, { disponible: false }, { new: true }, (err, productoDb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe ó no esta disponible'
            })
        }

        res.json({
            ok: true,
            producto: productoDb

        })

    })


})




module.exports = app;