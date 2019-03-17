const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')



// Importamos el Schema de usuario
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')
const app = express();



app.get('/usuario', [verificaToken], (req, res) => {




    // si viene el registro de inicio desde y si no 0
    let desde = req.query.desde || 0;
    desde = parseInt(desde);
    let limite = req.query.limite || 5;
    limite = parseInt(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)

    .exec((err, usuarios) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        Usuario.countDocuments({ estado: true }, (err, conteo) => {

            res.json({
                ok: true,
                cuantos: conteo,
                usuarios
            });
        });
    })


    //res.json('get usuario Local!!');
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    // vamos a grabar lo que recibimos en la base de datos a traves del schema 
    // creamos el objeto 
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    // grabamos
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });
})



app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB

        })





    });

})


/*app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: 'No existe usuario'
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    })


});*/

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: 'false' }, { new: true }, (err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioDb === null) {
            return res.status(400).json({
                ok: false,
                err: 'No existe usuario'
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDb
        })
    })





})

module.exports = app;