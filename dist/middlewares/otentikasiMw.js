"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otentikasiMw = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otentikasiMw = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        jsonwebtoken_1.default.verify(authHeader, process.env.JWT_SECRET, (err, decodedUser) => {
            if (err) {
                console.error(err);
                return res.sendStatus(403);
            }
            req.user = decodedUser;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.otentikasiMw = otentikasiMw;
//# sourceMappingURL=otentikasiMw.js.map