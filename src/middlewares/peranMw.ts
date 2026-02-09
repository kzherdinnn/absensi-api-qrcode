import { Request, Response, NextFunction } from 'express';

export const aksesPeran = (...perans: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const peranPengguna = req.user.peran; // Ganti dengan mekanisme otentikasi Anda
    const normalizedPeran = peranPengguna ? peranPengguna.toLowerCase() : '';
    const normalizedAllowed = perans.map(p => p.toLowerCase());

    if (!normalizedAllowed.includes(normalizedPeran)) {
      return res.status(403).json({ message: 'Dilarang: Peran tidak sesuai' });
    }

    next();
  };
};
