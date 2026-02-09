import app, { connectToDatabase } from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
