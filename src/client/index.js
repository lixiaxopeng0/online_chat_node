// 登录信息
const client_ip = document.getElementsByClassName('client_ip')[0];
const username = document.getElementsByClassName('username')[0];
const submit_login_button = document.getElementsByClassName('submit_login_button')[0];

let client_ip_text = null;
let username_text = null;
let type = 'ok';

// 发送信息
const show_info = document.getElementsByClassName('show_info')[0];
const clinet_text_div = document.getElementsByClassName('clinet_text')[0];
const submit_button = document.getElementsByClassName('submit_button')[0];

let clientSocket = null;
let clinet_text = null;

function listen() {
    // 登录信息
    client_ip.addEventListener('change', clientChange);
    username.addEventListener('change', usernameChange);
    submit_login_button.addEventListener('click', submitLoginClick);
    // 发送信息
    submit_button.addEventListener('click', sendClick);
    clinet_text_div.addEventListener('change', clientTextChange);
}

// 创建服务
function createServer() {
    clientSocket = io(`ws://${client_ip_text}:8006`);
    clientSocket.emit('message', { username: username_text });
    clientSocket.on('showUser', ({text}) => {
        const div = document.createElement('div');
        div.innerHTML = text;
        div.className = 'tooltip';
        show_info.appendChild(div);
    });
    clientSocket.on('leave', (data) => {
        const div = document.createElement('div');
        div.innerHTML = data;
        div.className = 'tooltip_leave';
        show_info.appendChild(div);
    })
}

function clientTextChange(e) {
    let timer = null;
    clearTimeout(timer);
    timer = setTimeout(() => {
        clinet_text = e.target.value
    }, 50);
}

const list = [];
function sendClick() {
    if (type === 'ok') {
        confirm('请先填写访问地址和用户名')
        return;
    }

    if (!clinet_text) {
        return;
    }
    clientSocket.emit('send', { username: username_text, value: clinet_text, id: Math.random() });
    clientSocket.on('accepted', (data) => {
        const { username: name, value, id } = data;
        if (!list.includes(id)) {
            list.push(id)
            let users = document.createElement('div');
            let contentParent = document.createElement('div');
            let content = document.createElement('div');
            users.textContent = name;
            content.textContent = `${value}`;
            users.className = name === username_text ? 'self_name' : 'other_name';
            content.className = name === username_text ? 'self_content' : 'other_content';
            contentParent.className = name === username_text ? 'self_content_parent' : 'other_content_parent';
            show_info.appendChild(users);
            contentParent.appendChild(content);
            show_info.appendChild(contentParent);
            clinet_text_div.value = '';
            clinet_text = '';
            show_info.scrollTop = show_info.scrollHeight - contentParent.clientHeight;
        }
    });
}

function clientChange(e) {
    let timer = null;
    clearTimeout(timer);
    timer = setTimeout(() => {
        client_ip_text = e.target.value
    }, 50);
}

function usernameChange(e) {
    let timer = null;
    clearTimeout(timer);
    timer = setTimeout(() => {
        username_text = e.target.value
    }, 50);
}

function submitLoginClick() {
    if (!(client_ip_text && username_text)) {
        confirm('请先填写访问地址和用户名')
        return;
    }

    if (type === 'ok') {
        client_ip.disabled = true;
        username.disabled = true;
        submit_login_button.innerHTML = '编辑';
        type = 'edit';
        createServer();
    } else {
        client_ip.disabled = false;
        submit_login_button.innerHTML = '确定';
        type = 'ok';
    }
}
// 初始化
function init() {
    listen();
}

init();