const express   = require ('express');
const mongoose  = require('mongoose');
const Cliente   = require('../models/Cliente');
const User      = require('../models/User');
const Tabla     = require('../models/Tabla');
const Expert    = require('../models/Expert');
const Dieta     = require('../models/Dieta');

const expertRouter = express.Router();

expertRouter.get('/mis-servicios', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'El id no es válido'});
    return;
  }
  User.findById(req.user.id)
  .populate({path: 'expert', populate: {path: 'dietas'}})
  .populate({path: 'expert', populate: {path: 'dietas', populate: {path: 'cliente'}}})
  .populate({path: 'expert', populate: {path: 'dietas', populate: {path: 'cliente', populate: {path: 'detalles'}}}})
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

expertRouter.get('/mis-servicios/info/:id', (req, res, next) => {
  const principal = '5cae24fa74ebce3d72bacf9a'

  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'Spedified id is not valid'});
    return;
  }

  Tabla.findById(principal)
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
});

expertRouter.post('/mis-servicios/info/:id', (req, res, next) => {
  const nombre = req.body.nombre;
  const cedula = req.body.cedula;
  const titulo = req.body.titulo;
  const descripcion = req.body.descripcion;
  const rating = 0;
  const tabla = req.body.tabla;
  const dietas = [];
  const usuario = req.user._id;
  
  const newExpert = new Expert({    
    nombre: nombre,
    cedula: cedula,
    titulo: titulo,
    descripcion: descripcion,
    rating: rating,
    tabla: tabla,
    dietas: dietas,
    usuario: usuario
  })

  newExpert.save(err => {
      if (err) {
        res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
        return
      }
      res.status(200).json(newExpert);

      User.findById(usuario).exec(function(err, user) {
        user.expert.push(newExpert._id);
        user.save(err => {
          if(err)
          res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
          return
        })
      })
    });
  });

  expertRouter.put('/mis-servicios/info/:id', (req, res, next) => {
    const id = req.body.id
    const cambio = {
      datosExpert: req.body.datos
    }
      User.findOneAndUpdate({_id: id}, cambio)
        .then(() => {
          res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
        })
        .catch(err => {
          res.json(err)
        })
  })

  expertRouter.get('/mis-servicios/actualiza-info/:id', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
      res.status(400).json({message: 'Spedified id is not valid'});
      return;
    }
  
    User.findById(req.user.id).populate("expert")
      .then(response => {
        res.status(200).json (response);
      })
      .catch(err => {
        res.json(err);
      })
  });

  expertRouter.put('/mis-servicios/actualiza-info/:id', (req, res, next) => {
    const nombre = req.body.nombre
    const cedula = req.body.cedula
    const titulo = req.body.titulo
    const descripcion = req.body.descripcion
  
      const cambio = {
        nombre: nombre,
        descripcion: descripcion,
        cedula: cedula,
        titulo: titulo,
      }
    
      Expert.findOneAndUpdate({_id: req.params.id}, cambio)
        .then(() => {
          res.json({message: `Expert con id: ${req.params.id} se actualizó de manera exitosa.`});
        })
        .catch(err => {
          res.json(err)
        })
  })

  expertRouter.get('/oferta', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
      res.status(400).json({message: 'El id no es válido'});
      return;
    }
    Expert.find()
      .then(response => {
        res.status(200).json (response);
      })
      .catch(err => {
        res.json(err);
      })
  })

  expertRouter.post('/cita/:id', (req, res, next) => {
    const peso = req.body.peso;
    const grasa = req.body.grasa;
    const musculo = req.body.musculo;
    const abdomen = req.body.abdomen;
    const pecho = req.body.pecho;;
    const cliente = req.body.cliente;
    const expert = req.params.id;
    const dieta = {desayuno: [], comida: [], cena: []}
    
    const newDieta = new Dieta({
      tablaEquivalencias: [],  
      detallesObjetivo: {
        peso: peso,
        grasa: grasa,
        musculo: musculo,
        abdomen: abdomen,
        pecho: pecho,
      },
      rating: 0,
      cliente: cliente,
      expert: expert,
      dieta: dieta
    })

    newDieta.save(err => {
        if (err) {
          res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
          return
        }
        res.status(200).json(newDieta);
  
        Cliente.findById(cliente).exec(function(err, cliente) {
          cliente.dietas.push(newDieta._id);
          cliente.save(err => {
            if(err)
            res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
            return
          })
        })

        Expert.findById(expert).exec(function(err, expert) {
          expert.dietas.push(newDieta._id);
          expert.save(err => {
            if(err)
            res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
            return
          })
        })
      });
  })

  expertRouter.get('/plan-nutricional/:id', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
      res.status(400).json({message: 'El id no es válido'});
      return;
    }
  
    Dieta.findById(req.params.id)
    .populate({path: 'cliente', populate: {path: 'detalles'}})
    .populate({path: 'cliente', populate: {path: 'dietas'}})
    .populate({path: 'expert'})
      .then(response => {
        res.status(200).json (response);
      })
      .catch(err => {
        res.json(err);
      })
  })

  expertRouter.put('/plan-nutricional/:id', (req, res, next) => {
    const Dcarb = req.body.Dcarb;
    const Denergia = req.body.Denergia;
    const Dproteinas = req.body.Dproteinas;
    const Dgrasas = req.body.Dgrasas;
    const Dcolaciones = req.body.Dcolaciones;
    const Dcomentarios = req.body.Dcomentarios;

    const Lcarb = req.body.Lcarb;
    const Lenergia = req.body.Lenergia;
    const Lproteinas = req.body.Lproteinas;
    const Lgrasas = req.body.Lgrasas;
    const Lcolaciones = req.body.Lcolaciones;
    const Lcomentarios = req.body.Lcomentarios;

    const Ccarb = req.body.Ccarb;
    const Cenergia = req.body.Cenergia;
    const Cproteinas = req.body.Cproteinas;
    const Cgrasas = req.body.Cgrasas;
    const Ccolaciones = req.body.Ccolaciones;
    const Ccomentarios = req.body.Ccomentarios;
  
    const desayuno = {
      carbohidratos: Dcarb,
      energia: Denergia,
      proteinas: Dproteinas,
      grasas: Dgrasas,
      colaciones: Dcolaciones,
      comentarios: Dcomentarios
    }

    const comida = {
      carbohidratos: Lcarb,
      energia: Lenergia,
      proteinas: Lproteinas,
      grasas: Lgrasas,
      colaciones: Lcolaciones,
      comentarios: Lcomentarios
    }

    const cena = {
      carbohidratos: Ccarb,
      energia: Cenergia,
      proteinas: Cproteinas,
      grasas: Cgrasas,
      colaciones: Ccolaciones,
      comentarios: Ccomentarios
    }

      Dieta.findById(req.params.id).exec(function(err, dieta) {
        dieta.dieta.desayuno.unshift(desayuno);
        dieta.dieta.comida.unshift(comida);
        dieta.dieta.cena.unshift(cena);
        dieta.save(err => {
          if(err)
          res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
          return
        })
        res.status(200).json(dieta);
      })
  })


module.exports = expertRouter;