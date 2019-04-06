const express = require('express');

const _ = require('underscore')

const app = express();

let Categoria = require('../models/categoria')
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

//==============================
// Mostrar todas las Categorias
//==============================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('idUsuario', 'nombre email')
        .exec((err, categoriasDb) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    categorias: categoriasDb
                })

            })

        })




})


//==============================
// Busqueda de categoria por ID
//==============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;


    Categoria.findById(id, (err, categoriaDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDb

        })

    })


})



//==============================
// Modificando una nueva Categoria
//==============================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Categoria.findOneAndUpdate({ _id: id },
        body, { new: true, runValidators: true },
        (err, categoriaDb) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!categoriaDb) {
                return res.status(400).json({
                    ok: false,
                    message: 'La categoria no existe'
                })
            }
            res.json({
                ok: true,
                usuario: categoriaDb
            })

        })
})

//==============================
// Crear una  Categoria
//==============================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body
    body.idUsuario = req.usuario._id


    let categoria = new Categoria({
        descripcion: body.descripcion,
        idUsuario: body.idUsuario

    })

    // grabamos
    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });




    })
})


//==============================
// Borrando una  Categoria
//==============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id

    Categoria.findOneAndDelete({ _id: id }, (err, categoriaDb) => {

        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }
        if (categoriaDb === null) {
            return res.status(400).json({
                ok: false,
                err: 'No existe categoria'
            })
        } else {
            res.json({
                ok: true,
                categoria: categoriaDb
            })
        }








    })
})








module.exports = app;