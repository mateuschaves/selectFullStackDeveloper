import Post from '../models/Post';
import *  as Yup from 'yup';

class PostController {

    async index(req, res) {
        try {
            //Setting the default page value
            const { page = 1 } = req.query;

            //Pagination: Listing 5 posts
            const posts = await Post.findAll({
                where: { deleted_at: null },
                limit: 5,
                offset: (page - 1) * 5
            });

            return res.json(posts);
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Não foi possível listar as postagens.' });
        }
    }


    async show(req, res) {
        try {
            //Comparing the params id with the database id
            const post = await Post.findOne({
                where: {
                    id: req.params.postId
                }
            });

            //If the id does not exist in the database...
            if(!post){
                return res.status(400).json({ error: 'Essa postagem não existe.' });
            }

            return res.json(post);
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Erro. ' });
        }
    }


    async store(req, res) {
        try {
            //Checks if the fields have been filled correctly
            const schema = Yup.object().shape({
                title: Yup.string()
                    .required(),
                category: Yup.string()
                    .required(),
                content: Yup.string()
                    .required()
            });

            //Checks if the befored informations have all fields filled
            if(!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Todos os campos precisam ser preenchidos.' });
            }

            //Abstraction of fields
            const { title, category, content } = await Post.create(req.body);


            //If everything is correct, the information will be registered and returned.
            return res.json({
                title,
                category,
                content,
            });
        }
        catch (err) {
            console.log("Error: " + err);
            return res.status(400).json({error: 'Não foi possível efetuar o cadastro.'});
        }
    }


    async update(req, res) {
        try {
            //Comparing the params id with the database id
            const post = await Post.findOne({
                where: {
                    id: req.params.postId
                }
            });

            //If the id does not exist in the database...
            if(!post){
                return res.status(400).json({ error: 'Essa postagem não existe.' });
            }

            const { title, category, content } = req.body;

            //Updating information
            const postUpdate = await Post.update({
                title,
                category,
                content
            },
            {
                where: { id: req.params.postId }
            });

            //Return new data
            if(postUpdate) {
                const postUpdated = await Post.findOne({
                    where: {
                        id: req.params.postId
                    }
                });

                return res.json(postUpdated);
            }
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Erro:  ' + err });
        }
    }


    async delete(req, res) {
        try {
            //Capturing params id
            const { postId } = req.params;

            //Soft delete
            await Post.destroy({ where: { id: postId } });
            return res.json({ ok: true });
        }
        catch (err) {
            console.log("Error: " + err);
            res.status(400).json({error: 'Não foi possível deletar essa postagem.'});
        }
    }


    async destroy(req, res) {
        try {
            //Capturing params id
            const { postId } = req.params;

            //Force delete
                await Post.destroy({ where: { id: postId }, force: true });
                return res.json({ ok: true });
        }
        catch (err) {
            console.log("Error: " + err);
            res.status(400).json({error: 'Não foi possível deletar essa postagem.'});
        }
    }


    async restore(req, res) {
        try {
            //Capturing params id
            const { postId } = req.params;

            //Restores the deleted post (just soft deleted)
            await Post.restore({ where: { id: postId }});
            return res.json({ ok: true });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({error: 'Não foi possível restaurar essa postagem.'});
        }
    }

}

export default new PostController();
