const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

// definimos el tipo de datos de la entrada de datos
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']

    },

    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'el usuario es obligatorio']

    }

})

module.exports = mongoose.model('Categoria', categoriaSchema);