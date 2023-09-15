import { Request, Response, NextFunction } from 'express';

const generic = (req: Request, res: Response, next: NextFunction) => {

    const placa = req.body.placa as string;
    const renavam = req.body.renavam as string;

    if (!placa || !renavam) {
        return res.status(400).json({ message: 'Placa and Renavam are required' });
    }

    if(!req.headers.token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    if (process.env.TOKEN !== req.headers.token) {
        return res.status(401).json({ message: 'Token is not valid' });
    }

    next();

}

export default generic;