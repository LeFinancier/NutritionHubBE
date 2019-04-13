const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Cliente  = require('./Cliente');

const comida = new Schema ([{
  lunes: {
    desayuno: String,
    comida: String,
    cena: String,
    entrega: Date,
    validacion: Boolean
  },
  martes: {
    desayuno: String,
    comida: String,
    cena: String,
    entrega: Date,
    validacion: Boolean
  },
  miercoles: {
    desayuno: String,
    comida: String,
    cena: String,
    entrega: Date,
    validacion: Boolean
  },
  jueves: {
    desayuno: String,
    comida: String,
    cena: String,
    entrega: Date,
    validacion: Boolean
  },
  viernes: {
    desayuno: String,
    comida: String,
    cena: String,
    entrega: Date,
    validacion: Boolean
  },
  sabado: {
    desayuno: String,
    comida: String,
    cena: String,
    entrega: Date,
    validacion: Boolean
  },
  domingo: {
    desayuno: String,
    comida: String,
    cena: String,
    entrega: Date,
    validacion: Boolean
  },
  cliente: {type: Schema.Types.ObjectId, ref: 'Cliente'},
  store: {type: Schema.Types.ObjectId, ref: 'Store'}
}],{timestamps: true});

const Comida = mongoose.model ('Comida', comida);

module.exports = Comida;