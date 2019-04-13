const express    = require('express');
const authRoutes = express.Router();

const passport   = require('passport');
const bcrypt     = require('bcryptjs');

const User       = require('../models/User');


authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const tipo     = req.body.tipo;

  if(!username || !password) {
    res.status(400).json({message: 'Debes proporcionar un nombre de usuario y password'});
    return;
  }

  if(password.length < 7) {
    res.status(400).json({message: 'Tu contraseña debe contener por lo menos 8 caracteres'});
    return;
  }

  User.findOne({username}, (err, foundUser) => {
    if(err) {
      res.status(500).json({message: 'Algo salió mal con el nombre de usuario'});
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'Ya existe el nombre de usuario. Por favor intenta con uno nuevo'});
      return
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User ({
      username: username,
      password: hashPass,
      tipo: tipo,
      inicio: true,
      datosExpert: false,
      datosStore: false,
      expert: [],
      store: [],
      main: []
    });

    aNewUser.save(err => {
      if (err) {
        res.status(400).json({message: 'Algo salió mal al guardar en la BD'});
        return
      }

      req.login(aNewUser, (err) => {
        if(err) {
          res.status(500).json({message: 'No se pudo ingresar después del registro'});
          return
        }
        res.status(200).json(aNewUser);
      });
    });
  });
});

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if(err) {
      res.status(500).json({message: 'No se identificó el nombre de usuario'});
      return;
    }

    if(!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if(err) {
        res.status(500).json({message: 'La sesión falló'});
        return;
      }
      res.status(200).json(theUser);
    });
  }) (req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({message: 'Vuelve pronto'})
});

authRoutes.get('/loggedin', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({message:'Ingresa para continuar'})
});



module.exports = authRoutes;