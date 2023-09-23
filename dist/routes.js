"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
const MGController_1 = require("./controllers/MGController");
const ALController_1 = require("./controllers/ALController");
const PBController_1 = require("./controllers/PBController");
const GOController_1 = require("./controllers/GOController");
const MSController_1 = require("./controllers/MSController");
const BRController_1 = require("./controllers/BRController");
const RRController_1 = require("./controllers/RRController");
const PEController_1 = require("./controllers/PEController");
const SEController_1 = require("./controllers/SEController");
const PRController_1 = require("./controllers/PRController");
const MAController_1 = require("./controllers/MAController");
const TOController_1 = require("./controllers/TOController");
const PAController_1 = require("./controllers/PAController");
const PIController_1 = require("./controllers/PIController");
const AMController_1 = require("./controllers/AMController");
const SCController_1 = require("./controllers/SCController");
const middleware_1 = __importDefault(require("./middleware/middleware"));
routes.post('/multas/mg', middleware_1.default, MGController_1.mg.index);
routes.post('/multas/al', middleware_1.default, ALController_1.al.index);
routes.post('/multas/br', middleware_1.default, BRController_1.br.index);
routes.post('/multas/pb', middleware_1.default, PBController_1.pb.index);
routes.post('/multas/go', middleware_1.default, GOController_1.go.index);
routes.post('/multas/ms', middleware_1.default, MSController_1.ms.index);
routes.post('/multas/rr', middleware_1.default, RRController_1.rr.index);
routes.post('/multas/pe', middleware_1.default, PEController_1.pe.index);
routes.post('/multas/ma', middleware_1.default, MAController_1.ma.index);
routes.post('/multas/to', middleware_1.default, TOController_1.to.index);
routes.post('/multas/pa', middleware_1.default, PAController_1.pa.index);
routes.post('/multas/pi', middleware_1.default, PIController_1.pi.index);
routes.post('/multas/am', middleware_1.default, AMController_1.am.index);
routes.post('/multas/sc', middleware_1.default, SCController_1.sc.index);
routes.post('/multas/se', SEController_1.se.index);
routes.post('/multas/pr', PRController_1.pr.index);
exports.default = routes;
