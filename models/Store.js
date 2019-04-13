const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const store = new Schema({
  nombre: String,
  descripcion: String,
  direccion: String,
  condicionesEntrega: String,
  rating: String,
  pedidos: [{type: Schema.Types.ObjectId, ref: 'Comida'}],
  usuario: {type: Schema.Types.ObjectId, ref: 'User'},
});

const Store = mongoose.model('Store',store);

module.exports = Store;