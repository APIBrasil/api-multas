import express from 'express';
const routes = express.Router();

import { mg } from './controllers/MGController';
import { al } from './controllers/ALController';
import { pb } from './controllers/PBController';
import { go } from './controllers/GOController';
import { ms } from './controllers/MSController';
import { br } from './controllers/BRController';
import { rr } from './controllers/RRController';
import { pe } from './controllers/PEController';
import { se } from './controllers/SEController';
import { pr } from './controllers/PRController';
import { ma } from './controllers/MAController';
import { to } from './controllers/TOController';
import { pa } from './controllers/PAController';
import { pi } from './controllers/PIController';
import { am } from './controllers/AMController';

import middleware from './middleware/middleware';

routes.post('/multas/mg', middleware, mg.index);
routes.post('/multas/al', middleware, al.index);
routes.post('/multas/br', middleware, br.index);
routes.post('/multas/pb', middleware, pb.index);
routes.post('/multas/go', middleware, go.index);
routes.post('/multas/ms', middleware, ms.index);
routes.post('/multas/rr', middleware, rr.index);
routes.post('/multas/pe', middleware, pe.index);
routes.post('/multas/ma', middleware, ma.index);
routes.post('/multas/to', middleware, to.index);
routes.post('/multas/pa', middleware, pa.index);
routes.post('/multas/pi', middleware, pi.index);
routes.post('/multas/am', middleware, am.index);
routes.post('/multas/se', se.index);
routes.post('/multas/pr', pr.index);

export default routes;
