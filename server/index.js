let express = require('express')
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

// models
var User = require('./models/user');
var Chat = require('./models/chat');

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/my_chat')
.then(()=> {
console.log('Database connected');
})
.catch((error)=> {
console.log('Error connecting to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});

app.post('/login', (req, res)=> {
	User.findOne({ name: req.body.name }, (err, userExists)=> {
		if (userExists == null) {
			User.create(req.body, (err1, user)=> {
				if (!err1) {
					User.findOneAndUpdate({_id: user._id}, {login: true}, {new: true}, (err2, updatedUser)=> {
						res.json({
							success: true,
							msg: "Login Successful",
							user: updatedUser
						});
						User.find({}, (err, users)=> {
							io.emit('new-user', users);
						});
					})					
				} else {
					res.json({
						success: false,
						msg: "Error"
					})
				}
			})
		} else {
			User.findOneAndUpdate({_id: userExists._id}, {login: true}, {new: true}, (err2, updatedUser)=> {
				res.json({
					success: true,
					msg: "User already exists",
					user: updatedUser
				})
				User.find({}, (err, users)=> {
					io.emit('new-user', users);
				});
			})
		}
	})
})

app.post('/logout', (req, res)=> {
	User.findOneAndUpdate({_id: req.body.user_id}, {login: false}, {new: true}, (err, updatedUser)=> {
		if (!err) {
			res.json({
				success: true,
				msg: "Logged out successful"
			});
			
			User.find({}, (err, users)=> {
				io.emit('new-user', users);
			});
		}
	})
})

app.get('/get_all_users', (req, res)=> {
	User.find({}, (err, users)=> {
		if (!err) {
			res.json({
				success: true,
				msg: "Users fetched",
				users: users
			})
		} else {
			res.json({
				success: false,
				msg: "Error"
			})
		}
	})
});

app.post('/get_chat_by_user', (req, res)=> {
	var query = {
		$or: [
		    { 'sender_id': req.body.sender_id, 'receiver_id': req.body.receiver_id },
		    { 'sender_id': req.body.receiver_id, 'receiver_id': req.body.sender_id }
	    ]
	};

	Chat.find(query, (err, chat)=> {
		if (!err) {
			res.json({
				success: true,
				msg: "Chat fetched",
				chat: chat
			})
		} else {
			res.json({
				success: false,
				msg: "Error"
			})
		}
	})
})

io.on('connection', (socket) => {

    socket.on('new-message', (data) => {
      Chat.create(data, (err, chat)=> {
      	if (!err) {
      		io.emit('new-message',chat);
      	}
      })
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});