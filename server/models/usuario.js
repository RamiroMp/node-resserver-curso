const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const uniqueValidator = require('mongoose-unique-validator');
let mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true } })

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

// definimos el tipo de datos de la entrada de datos
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']

    },
    email: {
        type: String,
        required: [true, 'el correo es necesario'],
        unique: true,

    },
    password: {
        type: String,
        required: [true, 'el password es obligatorio'],
        hide: true
    },
    img: {
        type: String,
        required: false

    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default: true

    },
    google: {
        type: Boolean,
        default: false,
        required: false
    }



});

/*usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}*/

usuarioSchema.plugin(mongooseHidden);
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);