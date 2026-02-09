import expressWs from 'express-ws';
import app, { connectToDatabase } from "./app";
import ruteWs from './routes/ruteWs';

// Apply express-ws to the existing app for the local server
expressWs(app);

// Now apply websocket routes
// We need to cast app because express-ws modifies it
ruteWs(app as any);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
