import express from 'express';
const routes = express.Router();

import { mg } from './controllers/MGController';
import { al } from './controllers/ALController';
import { pb } from './controllers/PBController';

import middleware from './middleware/middleware';

routes.post('/multas/mg', middleware, mg.index);
routes.post('/multas/al', middleware, al.index);
routes.post('/multas/pb', middleware, pb.index);

export default routes;
