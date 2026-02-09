import app, { connectToDatabase } from '../src/app';

export default async function handler(req: any, res: any) {
    await connectToDatabase();
    app(req, res);
}
