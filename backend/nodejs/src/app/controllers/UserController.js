import User from '../models/User';
import *  as Yup from 'yup';

class UserController {
    async store(req, res) {
        //Checks if the fields have been filled correctly
        const schema = Yup.object().shape({
            name: Yup.string()
                .required('This field is required'),
            email: Yup.string()
                .email()
                .required('This field is required'),
            password: Yup.string()
                .required('This field is required')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    'Your password must contain at least one capital letter, one lowercase letter and one number.'
                  )
        });

        //Checks if the befored password have all characters of the rule
        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Your password must contain at least one capital letter, one lowercase letter and one number.' });
        }

        //Checks if the email already exists
        const userExists = await User.findOne({ where: { email: req.body.email } });
        if(userExists) {
            return res.status(400).json({error: 'User alredy exists.'});
        }

        //Abstraction of fields
        const { id, name, email } = await User.create(req.body);

        //If everything is correct, the information will be registered and returned.
        return res.json({
            id,
            name,
            email
        });
    }

    async update(req, res) {
        //Checks if the user wants to change the password, and if the fields were filled in correctly
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    'Your password must contain at least one capital letter, one lowercase letter and one number.'
                  ),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    'Your password must contain at least one capital letter, one lowercase letter and one number.'
                )
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                    password ? field.required().oneOf([Yup.ref('password')]) : field
            )
        });

        //Checks if the befored password have all characters of the rule
        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Your password must contain at least one capital letter, one lowercase letter and one number.' });
        }

        //Abstraction of fields
        const { email, oldPassword } = req.body;

        //Search the user for the primary key
        const user = await User.findByPk(req.userId);

        //Checks if the user wants to change the email, and if the fields were filled in correctly
        if(email != user.email) {
            const userExists = await User.findOne({ where: { email: email } });
            if(userExists) {
                return res.status(400).json({error: 'User alredy exists.'});
            }
        }

        //Checks if the existing old password
        if(oldPassword && !(await user.checkPassword(oldPassword))) {
            res.status(401).json({ error: 'Password doest not match' });
        }

        //Abstraction of fields
        const { id, name, avatar_id } = await user.update(req.body);

        //If everything is correct, it will return the new information abstracted from the user.
        return res.json({
            id,
            name,
            email,
            avatar_id
        });
    }

    async destroy(req, res) {
        //Search the user for the primary key
        const user = await User.findByPk(req.userId);

        //If found, will delete the user according to the id
        if(user) {
            await user.destroy();
            return res.json({ ok: true });
        }
    }
}

export default new UserController();
