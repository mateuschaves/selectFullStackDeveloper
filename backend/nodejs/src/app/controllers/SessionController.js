import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import * as Yup from 'yup';

class SessionController {
    //Checks if the fields have been filled
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string()
                .required('This field is required'),
            email: Yup.string()
                .email()
                .required('This field is required'),
            password: Yup.string()
                .required('This field is required')
        });

        //Checks if the befored information is correct
        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        //Abstraction of fields
        const { email, password } = req.body;

        //Checks for a user based on email
        const user = await User.findOne({where: { email } });

        //Checks if the befored email of user is correct
        if(!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        //Checks if the befored password of user is correct
        if(!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match.' });
        }

        //Abstraction of fields
        const { id, name } = user;

        //If everything is correct, it returns the user's abstracted information, and the token.
        return res.json({
            user: {
                id,
                name,
                email
            },
            token: jwt.sign(
                { id },
                authConfig.secret,
                { expiresIn: authConfig.expiresIn }
            ),
        })
    }
}

export default new SessionController();
