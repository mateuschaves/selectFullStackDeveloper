import { Router } from 'express';

import UserController from './app/controllers/UserController';
import PostController from './app/controllers/PostController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

import multer from 'multer';
import multerConfig from './config/multer';

const routes = new Router();
const upload = new multer(multerConfig);

//Route to register a new user
routes.post('/users', UserController.store);

//Route to login
routes.post('/sessions', SessionController.store);


/* From here you need authentication to access the route */
routes.use(authMiddleware);


/* Refering to Users */
routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);


//Route to files upload
routes.post('/files', upload.single('file'), FileController.store);


/* Refering to Post */
routes.post('/posts', PostController.store); //Create
routes.get('/posts', PostController.index); //List
routes.get('/post/:postId', PostController.show); //Detail
routes.put('/post/:postId', PostController.update); //Update
routes.put('/posts/:postId', PostController.delete); //Soft delete
routes.put('/post_restore/:postId', PostController.restore); //Restore
routes.delete('/posts/:postId', PostController.destroy); //Force delete


export default routes;
