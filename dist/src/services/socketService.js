"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeClient = exports.addClient = exports.broadcast = void 0;
const semuaPengguna = new Set();
// We use 'any' for the socket type to avoid express-ws dependency here.
// In reality it's the WebSocket object.
const broadcast = (pesan) => {
    semuaPengguna.forEach((pengguna) => {
        // Check readyState (1 = OPEN)
        if (pengguna.readyState === 1) {
            pengguna.send(pesan);
        }
    });
};
exports.broadcast = broadcast;
const addClient = (ws) => {
    semuaPengguna.add(ws);
};
exports.addClient = addClient;
const removeClient = (ws) => {
    semuaPengguna.delete(ws);
};
exports.removeClient = removeClient;
//# sourceMappingURL=socketService.js.map