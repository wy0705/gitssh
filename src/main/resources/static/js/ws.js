var socket = null,
    st = document.getElementById("service");

if (window.WebSocket) {
    socket = new WebSocket("ws://localhost:8000");
} else {
    alert("浏览器不支持websocket");
}

socket.onopen = function () {
    st.innerHTML = "已连接";
}
socket.onclose = function () {
    st.innerHTML = "连接已关闭";
}
socket.error = function () {
    st.innerHTML = "连接异常";
}
socket.onmessage = function (event) {
    var serverData = JSON.parse(event.data); //接受数据，有多种方式[数组，比较前后两次数据等]
    worker(serverData); //在game.js中定义
}

function sendCmd(cmd, data) {
    socket.send(JSON.stringify({cmd:cmd, data:data}));
}
