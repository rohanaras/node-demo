/*
    server.js
    main server script for our task list web service
*/

var port = 8080;

//load all modules that we need
//express web server framework
var express = require('express');

//sqlite library
var sqlite = require('sqlite3');

//body parser library
var bodyParser = require('body-parser');

//create a new express app
var app = express();

////add a route for our home page
//app.get('/', function(req, res) {
//    "use strict";
//    res.send('<h1> Hello World! </h1>');
//});


//tell express to serve static files from the static subdir
app.use(express.static(__dirname + '/static'));

//tel express to parse post body data as json
app.use(bodyParser.json());

//api rotue for getting tasks
app.get('/api/tasks', function(req, res, next) {
    "use strict";
    var sql = 'select rowid,title,done,createdOn from tasks where done != 1';
    db.all(sql, function(err, rows) {
        if (err) {
            return next(err);
        }

        res.json(rows);
    });
});

//when someone posts to /api/tasks...
app.post('/api/tasks', function(req, res, next) {
    "use strict";
    var newTask = {
        title: req.body.title,
        done: false,
        createdOn: new Date()
    };
    var sql = 'insert into tasks(title,done,createdOn) values(?,?,?)';
    db.run(sql, [newTask.title, newTask.done, newTask.createdOn], function(err) {
        if (err) {
            return next(err);
        }

        res.status(201).json(newTask);
    });
});

//when smoeone PUTs to /api/tasks/<task-id>...
app.put('/api/tasks/:rowid', function(req, res, next) {
    "use strict";
    var sql = 'update tasks set done=? where rowid=?';
    db.run(sql, [req.body.done, req.params.rowid], function(err) {
        if (err) {
            return next(err);
        }

        res.json(req.body);
    })
});

//create database
var db = new sqlite.Database(__dirname + '/data/tasks.db', function(err) {
    "use strict";
    if (err) {
        throw err;
    }

    var sql = 'create table if not exists tasks(title string,' +
        ' done int, createdOn datetime)';
    db.run(sql, function(err) {
        if (err) {
            throw err;
        }
    });

    //start the server
    app.listen(port, function() {
        "use strict";
        console.log('server is listening on http://localhost:' + port)
    });

});

