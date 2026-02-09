import app, { connectToDatabase } from '../src/app';

export default async function handler(req: any, res: any) {
    try {
        console.log("Request path:", req.url);
        if (!process.env.MONGO_URI) {
            console.error("Missing MONGO_URI in environment variables");
        }
        await connectToDatabase();
        return app(req, res);
    } catch (error) {
        console.error("Vercel Handler Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? String(error) : "Check logs for details"
        });
    }
}
