var express = require('express');
var reload = require('reload');
var app = express();
var dataFile = require('./data/data.json');
var io = require('socket.io')();

var http = require('http');
var myServer = http.createServer(function(request,respnose)
{
    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write('Roux Meetups');
    response.end();
});

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
   res.send(`
    <h1>Welcome</h1>
    <p>Roux Academy Meetups put together artists from all walks of life</p>
    `);
});
app.get('/speakers', function(req, res) {
   res.send(`
    <h1>Welcome</h1>
    <p>Roux Academy Meetups Speakers</p>
    `);
});
//way to input stuff into you routes

app.get('/speakers/:speakerid', function(req, res) {
    var speaker = dataFile.speakers[req.params.speakerid];
   res.send(`
    <h1>${speaker.title}</h1>
    <h2>with ${speaker.name}</h2>
    <p>${speaker.summary}</p>
    `);
});



//     var info = '';
//     dataFile.speakers.forEach(function(item) {   //loops thru speakers
//         info += `  //bec latest ver of js-this ver of node supports ES6- so
//         // can use templates strengths for flexible send command
//         <li>
//             <h2>${item.name}</h2>    //
//             <p>${item.summary}</p>
//         </li>
//         `;  //es6 back ticks allows variable to span multiple lines in my templates
//     });
//     res.send(`
//         <h1>Roux Academy Meetups</h1>
//         ${info}
//         `);
// });


// myServer.listen(3000);
// console.log('Go to http://localhost:3000 on your browser');

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Roux Meetups';
app.locals.allSpeakers = dataFile.speakers;

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/speakers'));
app.use(require('./routes/feedback'));
app.use(require('./routes/api'));
app.use(require('./routes/chat'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
//gives flexibiliity of running on any port - so we don't designative a port

io.attach(server);
io.on('connection', function(socket) {
  socket.on('postMessage', function(data) {
    io.emit('updateMessages', data);
  });
});

reload(server, app);
