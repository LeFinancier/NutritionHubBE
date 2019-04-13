const express   = require ('express');
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const Cliente   = require('../models/Cliente');
const User      = require('../models/User');
const Peso      = require('../models/Peso');

const router = express.Router();

router.get('/mis-datos', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'El id no es válido'});
    return;
  }

  User.findById(req.user.id)
  .populate({path: 'main', populate: {path: 'detalles'}})
  .populate({path: 'main', populate: {path: 'dietas'}})
  .populate({path: 'main', populate: {path: 'comidas'}})
  .populate({path: 'main', populate: {path: 'dietas', populate: {path: 'expert'}}})
  .populate({path: 'main', populate: {path: 'comidas', populate: {path: 'store'}}})
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

// router.put('/mis-datos', (req, res, next) => {
//   const id = req.body.id
//   const cambio = {
//     inicio: req.body.inicio
//   }
//     User.findOneAndUpdate({_id: id}, cambio)
//       .then(() => {
//         res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
//       })
//       .catch(err => {
//         res.json(err)
//       })
// })

router.get('/mis-datos/info/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'Spedified id is not valid'});
    return;
  }

  Cliente.find().populate("User")
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
});

router.post('/mis-datos/info/:id', (req, res, next) => {
  const nombre = req.body.nombre;
  const descripcionObjetivo = req.body.descripcionObjetivo;
  const direccion = req.body.direccion;
  const ejercicio = req.body.ejercicio;
  const alergias = req.body.alergias
  const usuario = req.user._id
  
  const newCliente = new Cliente({    
    nombre: nombre,
    descripcionObjetivo: descripcionObjetivo,
    direccion: direccion,
    ejercicio: ejercicio,
    alergias: alergias,
    detalles: [],
    dietas: [],
    comidas: [],
    usuario: usuario
  })

  newCliente.save(err => {
      if (err) {
        res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
        return
      }
      res.status(200).json(newCliente);
      console.log(newCliente)

      User.findById(usuario).exec(function(err, user) {
        user.main.push(newCliente._id);
        user.save(err => {
          if(err)
          res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
          return
        })
      })
    });
  });

router.put('/mis-datos/info/:id', (req, res, next) => {
  const id = req.body.id
  const cambio = {
    inicio: req.body.inicio
  }
    User.findOneAndUpdate({_id: id}, cambio)
      .then(() => {
        res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
      })
      .catch(err => {
        res.json(err)
      })
})

router.get('/mis-datos/actualiza-info/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'Spedified id is not valid'});
    return;
  }

  User.findById(req.user.id).populate("main")
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

router.put('/mis-datos/actualiza-info/:id', (req, res, next) => {
  const nombre = req.body.nombre
  const descripcionObjetivo = req.body.descripcionObjetivo
  const direccion = req.body.direccion
  const ejercicio = req.body.ejercicio
  const alergias = req.body.alergias

    const cambio = {
      nombre: nombre,
      descripcionObjetivo: descripcionObjetivo,
      direccion: direccion,
      ejercicio: ejercicio,
      alergias: alergias
    }
  
    Cliente.findOneAndUpdate({_id: req.params.id}, cambio)
      .then(() => {
        res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
      })
      .catch(err => {
        res.json(err)
      })
  
})

router.get('/mis-datos/usuario/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.user.id)) {
    res.status(400).json({message: 'Spedified id is not valid'});
    return;
  }

  User.findById(req.user.id).populate("main")
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

router.put('/mis-datos/usuario/:id', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  console.log(username, password)

  if(password.length < 7) {
    res.status(400).json({message: 'Tu contraseña debe contener por lo menos 8 caracteres'});
    return;
  }

  if(username === req.user.username) {
    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const cambio = {
      username: username,
      password: hashPass
    }
  
    User.findOneAndUpdate({_id: req.user._id}, cambio)
      .then(() => {
        res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
      })
      .catch(err => {
        res.json(err)
      })
  } else {
  User.findOne({username}, (err, foundUser) => {
    if(err) {
      res.status(500).json({message: 'Algo salió mal con el nombre de usuario'});
      return;
    }

  if (foundUser) {
    res.status(400).json({ message: 'Ya existe el nombre de usuario. Por favor intenta con uno nuevo'});
    return
  }

  if(!mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(400).json({message: 'Specified id is not valid'});
    return
  }

  const salt     = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);
  const cambio = {
    username: username,
    password: hashPass
  }

  User.findOneAndUpdate({_id: req.user._id}, cambio)
    .then(() => {
      res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
    })
    .catch(err => {
      res.json(err)
    })
  })
}
})

router.post('/mis-datos/info/:id', (req, res, next) => {
  const nombre = req.body.nombre;
  const descripcionObjetivo = req.body.descripcionObjetivo;
  const direccion = req.body.direccion;
  const ejercicio = req.body.ejercicio;
  const alergias = req.body.alergias
  const usuario = req.user._id
  
  const newCliente = new Cliente({    
    nombre: nombre,
    descripcionObjetivo: descripcionObjetivo,
    direccion: direccion,
    ejercicio: ejercicio,
    alergias: alergias,
    detalles: [],
    dietas: [],
    comidas: [],
    usuario: usuario
  })

  newCliente.save(err => {
      if (err) {
        res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
        return
      }
      res.status(200).json(newCliente);
      console.log(newCliente)

      User.findById(usuario).exec(function(err, user) {
        user.main.push(newCliente._id);
        user.save(err => {
          if(err)
          res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a usuario'})
          return
        })
      })
    });
  });

router.post('/mis-datos', (req, res, next) => {
  const peso = req.body.peso
  const estatura = req.body.estatura
  const grasa = req.body.grasa
  const musculo = req.body.musculo
  const agua = req.body.agua
  const abdomen = req.body.abdomen
  const pecho = req.body.pecho
  const cliente = req.body.cliente

  
  const newPeso = new Peso ({
    detalles: {
      peso: peso,
      estatura: estatura,
      grasa: grasa,
      musculo: musculo,
      agua: agua,
      abdomen: abdomen,
      pecho: pecho,
    },
    cliente: cliente
  })

  newPeso.save(err => {
    if (err) {
      res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
      return
    }
    res.status(200).json(newPeso);
    console.log(newPeso)

    Cliente.findById(cliente).exec(function(err, cliente) {
      cliente.detalles.unshift(newPeso._id);
      cliente.save(err => {
        if(err)
        res.status(400).json({message: 'Algo salió mal al guardar en la BD la referencia a peso'})
        return
      })
    })
  });
})

router.get('/mis-datos/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({message: 'Spedified id is not valid'});
    return;
  }

  Cliente.findById(req.params.id).populate('comida')
    .then(response => {
      res.status(200).json (response);
    })
    .catch(err => {
      res.json(err);
    })
})

router.put('/mis-datos/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({message: 'Specified id is not valid'});
    return
  }

  Cliente.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({message: `Cliente con id: ${req.params.id} se actualizó de manera exitosa.`});
    })
    .catch(err => {
      res.json(err)
    })
})

router.delete('/mis-datos/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid (req.params.id)) {
    res.status(400).json({message: 'Specified id is not valid'});
    return
  }

  Cliente.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({message: `Cliente con id: ${req.params.id} se eliminó exitosamente`});
    })
    .catch(err => {
      res.json(err)
    })
})

module.exports = router;