const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Cliente  = require('./Cliente');

const dieta = new Schema ({
  tablaEquivalencias: [],
  dieta: {
    desayuno:[],
    comida: [],
    cena: [],
  },
  detallesObjetivo: {
    peso: Number,
    grasa: Number,
    musculo: Number,
    abdomen: Number,
    pecho: Number
  },
  rating: Number,
  cliente: {type: Schema.Types.ObjectId, ref: 'Cliente'},
  expert: {type: Schema.Types.ObjectId, ref: 'Expert'}
},{timestamps: true});

const Dieta = mongoose.model ('Dieta', dieta);

module.exports = Dieta;