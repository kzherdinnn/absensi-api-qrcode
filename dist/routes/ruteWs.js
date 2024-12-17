"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
const semuaPengguna = new Set();
const broadcast = (pesan) => {
    semuaPengguna.forEach((pengguna) => {
        console.log("pengguna.readyState", pengguna.readyState);
        if (pengguna.readyState === 1) {
            pengguna.send(pesan);
        }
    });
};
exports.broadcast = broadcast;
const ruteWs = (app) => {
    app.ws('/ws', (ws, req) => {
        semuaPengguna.add(ws);
        console.log('Pengguna terhubung');
        ws.on('message', (pesan) => {
            console.log('Pesan diterima:', pesan);
            ws.send(`Pesan diterima: ${pesan}`);
        });
        ws.on('close', () => {
            semuaPengguna.delete(ws);
            console.log('Pengguna terputus');
        });
    });
};
exports.default = ruteWs;
//# sourceMappingURL=ruteWs.js.map