const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: [true, 'No pueden exisitir dos categorías con el mismo nombre']
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Categoria', categoriaSchema);