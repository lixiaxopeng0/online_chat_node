const express = require('express');
const cors = require('cors');
const app = express();
// 允许所有跨域请求
app.use(cors());

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*', // 允许所有跨域请求
        // credentials: true, // 允许带上 cookie
    }
});
// const fs = require('fs');

http.listen(8006, () => {
    console.log('http://192.168.0.104:8006, 服务器已开启...');
});

let login_username = '';
// const loginUserFile = 'login.txt';
// let loginText = '';
io.on('connection', (socket) => {
    console.log('连接成功...')
    socket.on('message', (data) => {
        login_username = data.username;
        // fs.readFile('file.txt', 'utf8', (err, data) => {
        //     loginText = data;
        //     if (err) throw err;
        // });
        // const isHasLogined = loginText?.split(',').includes(data.username);
        // if (!isHasLogined) {
        //     fs.appendFile(loginUserFile, `${data.username},`, (err) => {
        //         if (err) throw err;
        //         console.log('The data was appended to file!');
        //     });
        // }
        io.emit('showUser', `"${data.username}"已加入聊天群！`);
    });
    socket.on('send', (data) => {
        io.emit('accepted', data);
    });
    socket.on('disconnect', () => {
        io.emit('leave', `"${login_username}"离开聊天室`);
    });
});