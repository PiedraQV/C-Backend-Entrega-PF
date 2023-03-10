const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
const passport = require('passport');
const parseArgs = require('minimist');
const args = parseArgs(process.argv.slice(2));
const PORT = args._[0] || 8080;
const logger = require ('./middlewares/logguer/logguer')

const router = require('./routes/router');
const Container = require('./socket/container.js');
require('./middlewares/auth');
const { mongodb } = require('./options/config.js');

const app = express();

const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);
const messages = new Container(mongodb, 'messages');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(
	session({
		secret: process.env.MONGODBURL,
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: {
			httpOnly: false,
			secure: false,
			maxAge: 100000,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('views'));
app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');
app.use(router);

io.on('connection', async socket => {
	console.log('Conexión establecida');
	const dbMessages = await messages.getAll();
	io.sockets.emit('messages', dbMessages);
	socket.on('message', async message => {
		messages.save(message);
		const dbMessages = await messages.getAll();
		io.sockets.emit('messages', dbMessages);
	});
});

const server = httpserver.listen(PORT, () => {
	mongoose.connect(process.env.MONGODBURL), (err)=>{
		err
		? logger.error("⛔ Error al conectarse a MongoDB")
        : logger.info("🆗 Conectaste a MongoDB")
	};
	console.log(`Server running on port ${PORT}`);
	logger.info("🆗 Conectaste a MongoDB")
});
server.on('error', err => console.log(`Error: ${err}`));