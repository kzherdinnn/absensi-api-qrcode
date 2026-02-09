const semuaPengguna: Set<any> = new Set();
// We use 'any' for the socket type to avoid express-ws dependency here.
// In reality it's the WebSocket object.

export const broadcast = (pesan: string) => {
    semuaPengguna.forEach((pengguna) => {
        // Check readyState (1 = OPEN)
        if (pengguna.readyState === 1) {
            pengguna.send(pesan);
        }
    });
};

export const addClient = (ws: any) => {
    semuaPengguna.add(ws);
};

export const removeClient = (ws: any) => {
    semuaPengguna.delete(ws);
};
