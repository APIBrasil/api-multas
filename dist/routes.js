"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
const MGController_1 = require("./controllers/MGController");
const ALController_1 = require("./controllers/ALController");
const middleware_1 = __importDefault(require("./middleware/middleware"));
routes.post('/multas/mg', middleware_1.default, MGController_1.mg.index);
routes.post('/multas/al', middleware_1.default, ALController_1.al.index);
exports.default = routes;
