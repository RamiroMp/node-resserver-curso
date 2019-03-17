const jwt = require('jsonwebtoken');
require('../config/config')


//================
//Verificar token
//================

let verificaToken = (req, res, next) => {

    // leer Header de las peticiones
    // leemos del header con get y lehemos el campo denomminado como token 
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }

            })
        }
        // aporto la informacion validad al req y tengo esta informacion disponible
        // en las peticiones por ejemplo para insertar datos ...
        req.usuario = decoded.usuario;
        next();



    })


};

//================
//Verificar Admin Role
//================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {
        console.log(usuario.role);

        return res.status(401).json({
            ok: false,
            message: 'El usuario no esta autorizado'
        })

    }
    next();



}





module.exports = { verificaToken, verificaAdmin_Role }