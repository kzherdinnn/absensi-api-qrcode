"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aksesPeran = void 0;
const aksesPeran = (...perans) => {
    return (req, res, next) => {
        const peranPengguna = req.user.peran; // Ganti dengan mekanisme otentikasi Anda
        if (!perans.includes(peranPengguna)) {
            return res.status(403).json({ message: 'Dilarang' });
        }
        next();
    };
};
exports.aksesPeran = aksesPeran;
//# sourceMappingURL=peranMw.js.map