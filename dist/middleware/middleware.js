"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic = (req, res, next) => {
    const placa = req.body.placa;
    const renavam = req.body.renavam;
    if (!placa || !renavam) {
        return res.status(400).json({ message: 'Placa and Renavam are required' });
    }
    if (!req.headers.token) {
        return res.status(401).json({ message: 'Token is required' });
    }
    if (process.env.TOKEN !== req.headers.token) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
    next();
};
exports.default = generic;
