import { Express } from 'express';
import { Application } from 'express-ws';

const semuaPengguna: Set<any> = new Set();

export const broadcast = (pesan: string) => {
  semuaPengguna.forEach((pengguna) => {
    console.log("pengguna.readyState", pengguna.readyState)
    if (pengguna.readyState === 1) {
      pengguna.send(pesan);
    }
  })
}

const ruteWs = (app: Application & Express) => {
  app.ws('/ws', (ws, req) => {
    semuaPengguna.add(ws)
    console.log('Pengguna terhubung');

    ws.on('message', (pesan) => {
      console.log('Pesan diterima:', pesan);
      ws.send(`Pesan diterima: ${pesan}`)
    });

    ws.on('close', () => {
      semuaPengguna.delete(ws)
      console.log('Pengguna terputus');
    });
  });
};

export default ruteWs;
