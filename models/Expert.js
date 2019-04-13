const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const expert = new Schema({
  nombre: String,
  cedula: String,
  titulo: String,
  descripcion: String,
  rating: Number,
  tabla: Array,
  dietas: [{type: Schema.Types.ObjectId, ref: 'Dieta'}],
  usuario: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Expert = mongoose.model('Expert',expert);

module.exports = Expert;