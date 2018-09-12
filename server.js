var app = require('express')();
var serv = require('http').createServer(app);
var io = require('socket.io').listen(serv);

app.get('/', function (req, res) {
    res.render('todolist.ejs', {});
});

let datas = [];

io.sockets.on('connection', function (socket) {
    socket.emit('set_tasks', datas);

    socket.on('new_task', function (data) {
        datas.push(data);
        socket.emit('set_tasks', datas);
        socket.broadcast.emit('set_tasks', datas);
    });
    socket.on('check_task', function (data) {
        for (let i = 0; i < datas.length; i++) {
            if (datas[i] === data) {
                datas.splice(i, 1);
            }
        }
        socket.emit('set_tasks', datas);
        socket.broadcast.emit('set_tasks', datas);
    })
});

serv.listen(80);

console.log('the app is running on http://127.0.0.1:8080');