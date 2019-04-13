const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Cliente  = require('./Cliente');
const Expert   = require('./Expert')

const userSchema = new Schema({
  username: String,
  password: String,
  tipo: String,
  inicio: Boolean,
  datosExpert: Boolean,
  datosStore: Boolean,
  main: [{type: Schema.Types.ObjectId, ref: 'Cliente'}],
  expert: [{type: Schema.Types.ObjectId, ref: 'Expert'}],
  store: [{type: Schema.Types.ObjectId, ref: 'Store'}]
}, 
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;