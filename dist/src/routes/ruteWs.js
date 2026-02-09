"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketService_1 = require("../services/socketService");
// This file DOES depend on express-ws, but should only be imported by server.ts (local)
// and NOT by app.ts (vercel).
const ruteWs = (app) => {
    app.ws('/ws', (ws, req) => {
        (0, socketService_1.addClient)(ws);
        console.log('Pengguna terhubung');
        ws.on('message', (pesan) => {
            console.log('Pesan diterima:', pesan);
            ws.send(`Pesan diterima: ${pesan}`);
        });
        ws.on('close', () => {
            (0, socketService_1.removeClient)(ws);
            console.log('Pengguna terputus');
        });
    });
};
exports.default = ruteWs;
//# sourceMappingURL=ruteWs.js.map