const sqlite3 = require('sqlite3').verbose();
const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	
	//Make sure you really do change the user values to something simple such as "aa" as I've shown below if you're working from the HackerU source code because you may entering the info many times in the login form.

	db.run("INSERT INTO user VALUES ('robert', 'bobby', 'sillyguy')");
});


app.get('/', function (req, res) {
	res.sendFile('index.html');
});


app.post('/login', function (req, res) {
	const username = req.body.username;
	const password = req.body.password;


	// This is the legitimate query that is run in the backend (how depends on the specific programming language ecosystem and framework being used)
	// when the user enters their username and password in the form:
	
	const query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";


	console.log("username: " + username);
	console.log("password: " + password);
	console.log('query: ' + query);


	// Keep in mind that allowing a string to be passed directly into your database like this as a parameter in a route handler in real life (without 
	// proper precautions such as using a prepared statement, is NOT a good way to make SQL queries for production because it makes your app extremely vulnerable. It's only for coding in development mode, your own non-commercial portfolio projects, or for a demo like this. 
	
	// This is the exact input that will achieve the result when entered in the username field and the correct password is used: unknown' OR '1'='1

	// When you can log in successfully by entering these malicious characters instead of a valid password, you'll know your hack has been a success!


	db.get(query, function (err, row) {
		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
			res.send('There\'s been an error')
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send(
			"Hello <b>" + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>'
			)
			res.send('Login successful')


			// NOTES:

			// 1. Comment out the long "malicious attack code" in the db.get(query...) method call above. This code was just some hardcoded fun.

			// 2. Then uncomment out res.send('Login successful') so that you can see the user log in successfully.

			// 3. If you run into any weird errors that pop up even if you've had the app run correctly before, try deleting the package-lock.json file and 
			// the node_modules folder and then running npm install again.

		}
	});


});


app.listen(3000, function () {
	console.log("express is listening on port 3000");
}); ``