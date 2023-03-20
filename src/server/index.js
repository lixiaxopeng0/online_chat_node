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
const fs = require('fs');

let login_username = '';
const loginUserFile = './login.txt';
let loginText = '';
http.listen(8006, () => {
    console.log('http://192.168.0.104:8006, 服务器已开启...');
    fs.readFile(loginUserFile, 'utf8', (err, data) => {
        if (err) throw err;
        loginText = data;
    });
});

io.on('connection', (socket) => {
    console.log('连接成功...')
    socket.on('message', async (data) => {
        login_username = data.username;
        const isHasLogined = loginText.includes(`,${login_username},`, loginText);
        if (!isHasLogined) {
            fs.appendFile(loginUserFile, `${login_username},`, (err) => {
                if (err) throw err;
                console.log('The data was appended to file!');
            });
            loginText = `${loginText}${login_username},`;
        }
        io.emit('showUser', {
            text: `"${login_username}"已加入聊天群！`,
            login_username,
        });
    });
    socket.on('send', (data) => {
        io.emit('accepted', data);
    });
    socket.on('disconnect', () => {
        io.emit('leave', `"${login_username}"离开聊天室`);
        loginText.replace(`,${login_username},`, ',');
        fs.writeFile(loginUserFile, loginText, (err) => {
            if (err) throw err;
            console.log('The data was writed to file!');
        });
    });
});