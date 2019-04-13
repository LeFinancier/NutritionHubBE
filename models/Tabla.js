const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const tabla = new Schema({
  tabla: Array,
  expert: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Tabla = mongoose.model('Tabla',tabla);

module.exports = Tabla;