const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Cliente  = require('./Cliente');

const peso = new Schema ({
  detalles: {
    peso: Number,
    estatura: Number,
    grasa: Number,
    musculo: Number,
    agua: Number,
    abdomen: Number,
    pecho: Number,
  },
  cliente: {type: Schema.Types.ObjectId, ref: 'Cliente'},
},{timestamps: true});

const Peso = mongoose.model ('Peso', peso);

module.exports = Peso;
