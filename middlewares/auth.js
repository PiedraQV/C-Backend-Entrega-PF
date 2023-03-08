const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require ('jsonwebtoken');
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

require('dotenv').config();

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

const log4js = require ('../middlewares/logguer/logguer');

passport.use('login', new LocalStrategy(
	(username, password, done) => {
		
		User.findOne({ username }, (error, user) => {
			if (error) return done(error);
			if (!user) return done(null, false, { message: 'Usuario y/o contraseña incorrectos' });
			if (!isValidPassword(user, password)) return done(null, false, { message: 'Usuario y/o contraseña incorrectos' });
			return done(null, user);
			
		})
	}
));

passport.use('signup', new LocalStrategy({
	passReqToCallback: true
},
	(req, username, password, done) => {
		User.findOne({ 'username': username }, (error, user) => {
			if (error) return done(error, user, { message: 'Error al intentar registrar el usuario' });
			if (user) return done(null, false, { message: 'El usuario ya existe' });
			
			const { nombre, age, direccion, telefono,  image} = req.body;
			const newUser = { username, password: createHash(password), nombre, age, direccion, telefono,  image }

			User.create(newUser, (error, userWithId) => {
				if (error) return done(error, user, { message: 'Error creando usuario' });
				return done(null, userWithId, { message: 'Usuario registrado' });
			})
		})
	}
));

passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.tokenkey,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload._id);
          if (user.code === 200) {
            return done(null, user.payload);
          }
          return done(null, returnMessage(true, 401, 'Usuario no encontrado'));
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => User.findById(id, done));
  
  
  const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()){
      const user = new User(req.user.payload);
      const userString = JSON.stringify(user);
      const token = jwt.sign(userString, process.env.tokenkey);
      const returnObject = returnMessage(
        false,
        200,
        'El usuario inició sesión correctamente',
        { token, user },
        null
       );
      console.log(returnObject)
      next()
    }
    else res.redirect('/login');
  }
  

//////////////////////////////LOGS////////////////////////////////////



const loggerMiddleware = (req, _res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`)
    next();
}



const returnMessage = (
	isError,
	code,
	message,
	payload,
	error = undefined
  ) => {
	if (code >= 500) {
	  logger.error(`${message} ${error || ""}`);
	} else if (code >= 400) {
	  logger.warn(message);
	}
	return {
	  status: isError ? "error" : "success",
	  code,
	  message,
	  payload,
	};
  };
  


module.exports = checkAuthentication, loggerMiddleware, returnMessage;