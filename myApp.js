let express = require('express');
let app = express();
// **import and load the environment variables from .env file into process.env**
require('dotenv').config();
let bodyParser = require('body-parser');
// **Mount a middleware**
app.use(bodyParser.urlencoded({extended: false}));

//app.use(bodyParser.json()); --- older version.
app.use(express.json());
// Use app.use([optional-path], middlewareFunction) and the function will be executed for ALL the requests
// Serves static assests using **Middleware** (express.static(path))
// examples of static assets: stylesheets, scripts, images
// Middleware are functions that intercept route handlers, adding some kind of information
app.use('/public', express.static(__dirname + '/public'));

// ** TESTING--- Want to log req and req.headers
// app.get('/testing', (req, res) => {
//   //console.log('log req here-----', req);
//   console.log('log req.headers here-----', req.headers);
// });

// **mount another middleware**
// root-level request logger middleware
app.get('/json', (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

//**Chain a middleware within a route defintion**
//app.get(path, middlewareFunction, handler);
app.get('/now', (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({'time': req.time});
});

// **Route parameters___req.params**
// route parameters are named segments of URL
// e.g.
// route_path: '/user/:userId/book/:bookId'
// actual_request_URL: '/user/546/book/6754'
// req.params: {userId: '546', bookId: '6754'}
app.get('/:word/echo', (req, res) => {
  const { word } = req.params;
  res.json({'echo': word});
});

//**Query parameter**
// route_path: '/library'
// actual_request_URL: '/library?userId=546&bookId=6754'
// req.query: {userId: '546', bookId: '6754'}

// app.get('/name', (req, res) => {
//   const { first: firstName, last: lastName } = req.query;
//   res.json({ 'name': `${firstName} ${lastName}`});
// });

// // POST request

// app.post('/name', (req, res) => {
//   const { first: firstName, last: lastName } = req.body;
//   res.json({'name': `${firstName} ${lastName}`});
// });

// chain different verb handlers on the same path route
app.route('/name').get((req, res) => {
  const { first: firstName, last: lastName } = req.query;
  res.json({ 'name': `${firstName} ${lastName}`});
}).post((req, res) => {
  const { first: firstName, last: lastName } = req.body;
  res.json({'name': `${firstName} ${lastName}`});
});
// **Chain different verb handlers on the same path route**
// app.route(path).get(handler).post(handler);

//**Route handler**
//app.METHOD(PATH, HANDLER)

// Serves the string to GET request matching the root path
// app.get('/', (req, res) => {
//   res.send('Hello Express');
// });

// Serves an HTML file to a GET request using res.sendFile(absolute path)
// absolute path = __dirname + relativePath/file.ext
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Serves JSON on a specific route
// **JSON is a convenient way to represent JavaScript object as a string,
// so it can be easily tranmitted. **

// **API serves data**
// What is RestAPI? -Representational state transfer.
// A client doesn't need to know any detail about the server.
// app.get('/json', (req, res) => {
//   var response = {'message': 'Hello json'};
//   if (process.env.MESSAGE_STYLE==='uppercase') {
//     response.message = response.message.toUpperCase();
//   }
//   return res.json(response);
// });

app.get('/json', (req, res) => {
  let message = 'Hello json';
  (process.env.MESSAGE_STYLE === 'uppercase') ? message=message.toUpperCase() : message=message; res.json({'message': message});
});

app.get('/secret', (req, res) => {
  res.json({'message': 'can you see this secret page?'});
});


//**Use body-parser to parse POST requests** Need to install the body-parser package.
// the body-parser package allows you to use a series of middleware
// POST method is used to send client data with HTML forms

module.exports = app;

