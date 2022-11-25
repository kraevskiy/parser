"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
const inversify_1 = require("inversify");
const types_1 = require("../types");
let ConfigService = class ConfigService {
    constructor(logger) {
        this.logger = logger;
        const result = (0, dotenv_1.config)();
        console.log(process.env.NODE_ENV);
        console.log(process.env.NODE_ENV === 'production');
        if (process.env.NODE_ENV === 'production') {
            this.config = process.env;
        }
        else if (result.error) {
            this.logger.error(`[ConfigService] File .env parse error or didn't find this file`);
        }
        else {
            this.logger.log('[ConfigService] Configuration .end downloaded');
            this.config = result.parsed;
        }
    }
    get(key) {
        return this.config[key];
    }
};
ConfigService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __metadata("design:paramtypes", [Object])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map