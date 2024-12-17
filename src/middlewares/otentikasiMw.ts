import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedUser {
  id: string;
  peran: string;
}

export const otentikasiMw = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err, decodedUser) => {
      if (err) {
        console.error(err)
        return res.sendStatus(403);
      }
      req.user = decodedUser as DecodedUser;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
