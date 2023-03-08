const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { fork } = require('child_process');
const compression = require('compression');


const info = (req, res) => {
	const hola = "Hola, estoy agregando más peso "
	const expHi = hola.repeat(1000)
	const processInfo = {
		argumentos_de_entrada: process.argv.slice(2),
		nombre_sistema_operativo: process.platform,
		version_node: process.version,
		memoria_total_reservada: process.memoryUsage().rss,
		path_de_ejecucion: process.execPath,
		process_id: process.pid,
		carpeta_del_proyecto: process.cwd(),
		expHi
		
	};
    res.status(200).json(processInfo);
}

const infoZip = (compression ({level:8, threshold:1}), (req, res) => {
	const hola = "Hola, estoy agregando más peso "
	const expHi = hola.repeat(1000)
	res.json({
		argumentos_de_entrada: process.argv.slice(2),
		nombre_sistema_operativo: process.platform,
		version_node: process.version,
		memoria_total_reservada: process.memoryUsage().rss,
		path_de_ejecucion: process.execPath,
		process_id: process.pid,
		carpeta_del_proyecto: process.cwd(),
		expHi
	});
})

const random =  (req, res) => {
	const forked = fork('./controllers/random.js');

	let { cantidad } = req.query;
	let obj = {};
	cantidad
		? forked.send({ cantidad, obj })
		: forked.send({ cantidad: 500000000, obj });
	forked.on('message', msg => res.json(msg));
}

const addToCart = (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if(err) {
            return res.redirect('/cart');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/cart');
    })
}

const deleteCart = (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}

const removeCart = (req, res, next) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}

const cart = (req, res, next) => {
    if(!req.session.cart) {
        return res.render('partials/cart', {products: null});
    }
    const cart = new Cart(req.session.cart);
    return res.render('partials/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
}

module.exports = { info, infoZip, random, addToCart, deleteCart, removeCart, cart };
