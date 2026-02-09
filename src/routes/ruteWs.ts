import { Express } from 'express';
import { Application } from 'express-ws';
import { addClient, removeClient } from '../services/socketService';

// This file DOES depend on express-ws, but should only be imported by server.ts (local)
// and NOT by app.ts (vercel).

const ruteWs = (app: Application & Express) => {
  app.ws('/ws', (ws, req) => {
    addClient(ws);
    console.log('Pengguna terhubung');

    ws.on('message', (pesan) => {
      console.log('Pesan diterima:', pesan);
      ws.send(`Pesan diterima: ${pesan}`)
    });

    ws.on('close', () => {
      removeClient(ws);
      console.log('Pengguna terputus');
    });
  });
};

export default ruteWs;
