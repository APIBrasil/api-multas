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
const middleware_1 = __importDefault(require("./middleware/middleware"));
routes.post('/multas/mg', middleware_1.default, MGController_1.mg.index);
routes.post('/multas/al', middleware_1.default, ALController_1.al.index);
routes.post('/multas/pb', middleware_1.default, PBController_1.pb.index);
routes.post('/multas/go', middleware_1.default, GOController_1.go.index);
exports.default = routes;
