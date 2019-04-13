const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Comida   = require('./Comida');
const Peso     = require('./Peso');
const Dieta    = require('./Dieta');
const User     = require('./User')

const cliente = new Schema({
  nombre: String,
  descripcionObjetivo: String,
  direccion: String,
  ejercicio: String,
  alergias: String,
  usuario: {type: Schema.Types.ObjectId, ref: 'User'},
  detalles: [{type: Schema.Types.ObjectId, ref: 'Peso'}],
  dietas: [{type: Schema.Types.ObjectId, ref: 'Dieta'}],
  comidas: [{type: Schema.Types.ObjectId, ref: 'Comida'}]
});

const Cliente = mongoose.model('Cliente',cliente);

module.exports = Cliente;