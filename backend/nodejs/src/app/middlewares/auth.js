import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    //Captures the Header's authorization token
    const authHeader = req.headers.authorization;

    //Checks if any token has been passed
    if(!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    //Divide header information from space to have only the token
    const [, token] = authHeader.split(' ');

    try {
        //It will try to decipher the token, and if it works, inside "decoded" it will contain some information about the user.
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        //Include user id within req
        req.userId = decoded.id

        //Proceeds
        return next();
    }
    //If something is wrong, return an error
    catch (err) {
        return res.status(401).json({ error: 'Token invalid' });
    }
}
