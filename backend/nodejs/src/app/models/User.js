import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        //Fields registered by the user
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
        },
        {
            sequelize,
        });

        //Hashes the password before save
        this.addHook('beforeSave', async (user) => {
            if(user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    //Relates the File table to the User table. Save the file id inside the User table.
    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id' });
    }

    /*
        Checks whether the password is correct before the user signs in.

        *As it is just a password check, and not necessarily a business rule, I left it in the model.*
    */
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
