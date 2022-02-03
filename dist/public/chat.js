"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)();
socket.on('connect', () => {
    console.log('Server Connected (From Client)');
});
socket.on('disconnect', () => {
    console.log('Server Disconnected (From Client)');
});
//# sourceMappingURL=chat.js.map