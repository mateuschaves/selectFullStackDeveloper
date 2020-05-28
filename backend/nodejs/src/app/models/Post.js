import Sequelize, { Model } from 'sequelize';

class Post extends Model {
    static init(sequelize) {
        //Fields registered by the user
        super.init({
            title: Sequelize.STRING,
            category: Sequelize.STRING,
            content: Sequelize.TEXT,
        },
        {
            sequelize,
            paranoid: true
        });

        return this;
    }
}

export default Post;
