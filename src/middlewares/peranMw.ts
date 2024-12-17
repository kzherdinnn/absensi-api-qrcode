import { Request, Response, NextFunction } from 'express';

export const aksesPeran = (...perans: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const peranPengguna = req.user.peran; // Ganti dengan mekanisme otentikasi Anda

    if (!perans.includes(peranPengguna)) {
      return res.status(403).json({ message: 'Dilarang' });
    }

    next();
  };
};
