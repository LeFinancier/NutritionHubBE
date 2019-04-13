const express   = require ('express');
const mongoose  = require('mongoose');
const Cliente   = require('../models/Cliente');
const Comida    = require('../models/Comida');
const User      = require('../models/User');
const Store     = require('../models/Store');

const router = express.Router();


router.get('/mi-cocina', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'El id no es válido'});
    return;
  }
  User.findById(req.user.id)
  .populate({path: 'store', populate: {path: 'pedidos'}})
  .populate({path: 'store', populate: {path: 'pedidos', populate: {path: 'cliente'}}})
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

router.post('/mi-cocina/info/:id', (req, res, next) => {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const direccion = req.body.direccion;
  const condiciones = req.body.condicionesEntrega;
  const rating = 0;
  const pedidos = [];
  const usuario = req.user._id;
  
  const newStore = new Store({    
    nombre: nombre,
    descripcion: descripcion,
    direccion: direccion,
    condicionesEntrega: condiciones,
    rating: rating,
    pedidos: pedidos,
    usuario: usuario
  })

  newStore.save(err => {
      if (err) {
        res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
        return
      }
      res.status(200).json(newStore);

      User.findById(usuario).exec(function(err, user) {
        user.store.push(newStore._id);
        user.save(err => {
          if(err)
          res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
          return
        })
      })
    });
  });

  router.put('/mi-cocina/info/:id', (req, res, next) => {
    const id = req.body.id
    const cambio = {
      datosStore: req.body.datos
    }
      User.findOneAndUpdate({_id: id}, cambio)
        .then(() => {
          res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
        })
        .catch(err => {
          res.json(err)
        })
  })


router.post('/mis-comidas', (req, res, next) => {
  Comida.create({
    lunes: [{
      desayuno: req.body.desayunoLunes,
      comida: req.body.comidaLunes,
      cena: req.body.cenaLunes,
      entrega: req.body.entregaLunes
    }],
    martes: {
      desayuno: req.body.desayunoMartes,
      comida: req.body.comidaMartes,
      cena: req.body.cenaMartes,
      entrega: req.body.entregaMartes
    },
    miercoles: {
      desayuno: req.body.desayunoMiercoles,
      comida: req.body.comidaMiercoles,
      cena: req.body.cenaMiercoles,
      entrega: req.body.entregaMiercoles
    },
    jueves: {
      desayuno: req.body.desayunoJueves,
      comida: req.body.comidaJueves,
      cena: req.body.cenaJueves,
      entrega: req.body.entregaJueves
    },
    viernes: {
      desayuno: req.body.desayunoViernes,
      comida: req.body.comidaViernes,
      cena: req.body.cenaViernes,
      entrega: req.body.entregaViernes
    },
    sabado: {
      desayuno: req.body.desayunoSabado,
      comida: req.body.comidaSabado,
      cena: req.body.cenaSabado,
      entrega: req.body.entregaSabado
    },
    domingo: {
      desayuno: req.body.desayunoDomingo,
      comida: req.body.comidaDomingo,
      cena: req.body.cenaDomingo,
      entrega: req.body.entregaDomingo
    },
    cliente: req.body.clienteID
  })
  .then(response => {
    Cliente.findByIdAndUpdate(req.body.clienteID, {$push: {comida: response._id}})
    .then(theResponse => {
      res.json(theResponse);  
    })
    .catch(err => {
      res.json(err);
    })
  })
  .catch(err => {
    res.json(err);
  })
});


router.put('/mis-comidas/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({message: 'Specified id is not valid'});
    return
  }

  Comida.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({message: `La comida con id: ${req.params.id} se actualizó de manera exitosa.`});
    })
    .catch(err => {
      res.json(err)
    })
})

router.delete('/mis-comidas/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid (req.params.id)) {
    res.status(400).json({message: 'Specified id is not valid'});
    return
  }

  Comida.findByIdAndRemove(req.params.id)
    ,then(() => {
      res.json({message: `La comida con id: ${req.params.id} se eliminó exitosamente`});
    })
    .catch(err => {
      res.json(err)
    })
})

router.get('/mi-cocina/actualiza-info/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'Spedified id is not valid'});
    return;
  }

  User.findById(req.user.id).populate("store")
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
});

router.put('/mi-cocina/actualiza-info/:id', (req, res, next) => {
  const nombre = req.body.nombre
  const descripcion = req.body.descripcion
  const direccion = req.body.direccion
  const condicionesEntrega = req.body.condicionesEntrega

    const cambio = {
      nombre: nombre,
      descripcion: descripcion,
      direcccion: direccion,
      condicionesEntrega: condicionesEntrega,
    }
  
    Store.findOneAndUpdate({_id: req.params.id}, cambio)
      .then(() => {
        res.json({message: `Expert con id: ${req.params.id} se actualizó de manera exitosa.`});
      })
      .catch(err => {
        res.json(err)
      })
})

router.get('/cocinas', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'El id no es válido'});
    return;
  }
  Store.find()
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

router.post('/solicitud/:id', (req, res, next) => {
  const Ldesayuno = req.body.Ldesayuno;
  const Lcomida = req.body.Lcomida;
  const Lcena = req.body.Lcena;

  const Mdesayuno = req.body.Mdesayuno;
  const Mcomida = req.body.Mcomida;
  const Mcena = req.body.Mcena;

  const MCdesayuno = req.body.MCdesayuno;
  const MCcomida = req.body.MCcomida;
  const MCcena = req.body.MCcena;

  const Jdesayuno = req.body.Jdesayuno;
  const Jcomida = req.body.Jcomida;
  const Jcena = req.body.Jcena;

  const Vdesayuno = req.body.Vdesayuno;
  const Vcomida = req.body.Vcomida;
  const Vcena = req.body.Vcena;

  const Sdesayuno = req.body.Sdesayuno;
  const Scomida = req.body.Scomida;
  const Scena = req.body.Scena;

  const Ddesayuno = req.body.Ddesayuno;
  const Dcomida = req.body.Dcomida;
  const Dcena = req.body.Dcena;

  const store = req.params.id;
  const cliente = req.body.cliente
  
  const newComida = new Comida({
    lunes: {
      desayuno: Ldesayuno,
      comida: Lcomida,
      cena: Lcena,
      entrega: '',
      validacion: false
    },
    martes: {
      desayuno: Mdesayuno,
      comida: Mcomida,
      cena: Mcena,
      entrega: '',
      validacion: false
    },
    miercoles: {
      desayuno: MCdesayuno,
      comida: MCcomida,
      cena: MCcena,
      entrega: '',
      validacion: false
    },
    jueves: {
      desayuno: Jdesayuno,
      comida: Jcomida,
      cena: Jcena,
      entrega: '',
      validacion: false
    },
    viernes: {
      desayuno: Vdesayuno,
      comida: Vcomida,
      cena: Vcena,
      entrega: '',
      validacion: false
    },
    sabado: {
      desayuno: Sdesayuno,
      comida: Scomida,
      cena: Scena,
      entrega: '',
      validacion: false
    },
    domingo: {
      desayuno: Ddesayuno,
      comida: Dcomida,
      cena: Dcena,
      entrega: '',
      validacion: false
    },
    cliente: cliente,
    store: store
  })

  newComida.save(err => {
      if (err) {
        res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
        return
      }
      res.status(200).json(newComida);

      Cliente.findById(cliente).exec(function(err, cliente) {
        cliente.comidas.unshift(newComida._id);
        cliente.save(err => {
          if(err)
          res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
          return
        })
      })

      Store.findById(store).exec(function(err, store) {
        store.pedidos.unshift(newComida._id);
        store.save(err => {
          if(err)
          res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
          return
        })
      })
    });
})

router.get('/asignar-alimentos/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'El id no es válido'});
    return;
  }
  Comida.findById(req.params.id)
  .populate({path: 'cliente', populate: {path: 'dietas'}})
  .populate({path: 'cliente', populate: {path: 'dietas', populate: {path: 'expert'}}})
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

router.put('/asignar-alimentos/:id', (req, res, next) => {
  
    const Ldesayuno = req.body.Ldesayuno;
    const Lcomida = req.body.Lcomida;
    const Lcena = req.body.Lcena;
    const Lentrega = req.body.Lentrega;

    const Mdesayuno = req.body.Mdesayuno;
    const Mcomida = req.body.Mcomida;
    const Mcena = req.body.Mcena;
    const Mentrega = req.body.Mentrega;

    const MCdesayuno = req.body.MCdesayuno;
    const MCcomida = req.body.MCcomida;
    const MCcena = req.body.MCcena;
    const MCentrega = req.body.MCentrega;

    const Jdesayuno = req.body.Jdesayuno;
    const Jcomida = req.body.Jcomida;
    const Jcena = req.body.Jcena;
    const Jentrega = req.body.Jentrega;

    const Vdesayuno = req.body.Vdesayuno;
    const Vcomida = req.body.Vcomida;
    const Vcena = req.body.Vcena;
    const Ventrega = req.body.Ventrega;

    const Sdesayuno = req.body.Sdesayuno;
    const Scomida = req.body.Scomida;
    const Scena = req.body.Scena;
    const Sentrega = req.body.Sentrega;

    const Ddesayuno = req.body.Ddesayuno;
    const Dcomida = req.body.Dcomida;
    const Dcena = req.body.Dcena;
    const Dentrega = req.body.Dentrega;

    const cambio = {  
    lunes : {
      desayuno: Ldesayuno,
      comida: Lcomida,
      cena: Lcena,
      entrega: Lentrega,
    },
    martes : {
      desayuno: Mdesayuno,
      comida: Mcomida,
      cena: Mcena,
      entrega: Mentrega,
    },
    miercoles : {
      desayuno: MCdesayuno,
      comida: MCcomida,
      cena: MCcena,
      entrega: MCentrega,
    },
    jueves : {
      desayuno: Jdesayuno,
      comida: Jcomida,
      cena: Jcena,
      entrega: Jentrega,
    },
    viernes : {
      desayuno: Vdesayuno,
      comida: Vcomida,
      cena: Vcena,
      entrega: Ventrega,
    },
    sabado : {
      desayuno: Sdesayuno,
      comida: Scomida,
      cena: Scena,
      entrega: Sentrega,
    },
    domingo : {
      desayuno: Ddesayuno,
      comida: Dcomida,
      cena: Dcena,
      entrega: Dentrega,
    }}

 

    Comida.findByIdAndUpdate(req.params.id, cambio)
    .then(() => {
      res.json({message: `La comida con id: ${req.params.id} se actualizó de manera exitosa.`});
    })
    .catch(err => {
      res.json(err)
    })
})

module.exports = router;