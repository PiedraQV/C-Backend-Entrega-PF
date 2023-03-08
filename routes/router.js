const router = require('express').Router();
const passport = require('passport');
const { getIndex, getLogin, getSignup, postLogin, postSignup, getFailLogin, getFailSignup, getLogout, failRoute } = require('../controllers/controller');
const { sendEmail, sendEmailCart } = require ('../controllers/sendmail');
const checkAuthentication = require('../middlewares/auth');

const logger = require ('../middlewares/logguer/logguer');
const { productShow, productCreate, renderProduct } = require ('../controllers/productsDb');
const { info, infoZip, random, addToCart, deleteCart, removeCart, cart } = require ('../controllers/controlsOptional');



// Index
router.get('/', checkAuthentication, getIndex);

// Login
router.get('/login', getLogin);
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), postLogin);
router.get('/faillogin', getFailLogin);

// Signup
router.get('/signup', getSignup);
router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), sendEmail, postSignup);
router.get('/failsignup', getFailSignup);

// Redirect to login & signup
router.post('/redirect-signup', (req, res) => res.redirect('/signup'));
router.post('/redirect-login', (req, res) => res.redirect('/login'));

// Logout
router.post('/logout', getLogout);

// Info
router.get('/info', info);

router.get('/infozip',infoZip );

// Api randoms
router.get('/api/randoms', random);

///////////////////-------------------CREACION PRODUCTOS------------------------------//////////////////

router.get('/product',checkAuthentication,  productShow);
router.get('/product-create', checkAuthentication,  renderProduct);
router.post('/create-product',checkAuthentication,  productCreate);


///////////////////-------------------CART------------------------------//////////////////


router.get('/cart/add-to-cart/:id', checkAuthentication, addToCart);

router.get('/cart/reduce/:id',checkAuthentication,  deleteCart);

router.get('/cart/remove/:id', checkAuthentication, removeCart );

router.get('/cart', checkAuthentication, cart );


///////////////////-------------------checkout------------------------------//////////////////

router.get('/checkout',checkAuthentication, (req, res) => {res.render('partials/checkout.handlebars');});

router.post('/checkout',checkAuthentication, sendEmailCart);

// Fail route
router.get('*', failRoute);



////////////////////////////////////

module.exports = router;