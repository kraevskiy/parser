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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const constants_1 = __importDefault(require("./constants"));
const jsdom_1 = require("jsdom");
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
let ParserService = class ParserService {
    constructor(logger) {
        this.logger = logger;
    }
    getWebsiteContent(vin) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield (0, node_fetch_commonjs_1.default)(constants_1.default.url(vin));
            return content.text();
        });
    }
    parseDom(stringToGenDom) {
        const dom = new jsdom_1.JSDOM(stringToGenDom);
        const document = dom.window.document;
        const tablesDOM = [...document.querySelectorAll(constants_1.default.tablesSelector)];
        const result = {
            tables: [],
            photos: []
        };
        tablesDOM.forEach(dom => {
            const tableData = {
                title: '',
                content: []
            };
            const titleDom = dom.querySelector('h2');
            if (titleDom) {
                tableData.title = titleDom.innerHTML;
            }
            const trDom = [...dom.querySelectorAll('table tr')];
            trDom.forEach(tr => {
                const trRes = {
                    name: '',
                    value: ''
                };
                const tdDom = [...tr.querySelectorAll('td')];
                if (tdDom.length === 2) {
                    trRes.name = tdDom[0].innerHTML;
                    trRes.value = tdDom[1].innerHTML;
                }
                tableData.content.push(trRes);
            });
            result.tables.push(tableData);
        });
        const photosDOM = [...document.querySelectorAll(constants_1.default.photosSelector)];
        photosDOM.forEach(photo => {
            result.photos.push(photo.href);
        });
        return result;
    }
    parse(vin) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.getWebsiteContent(vin);
            const domParsed = this.parseDom(content);
            this.logger.log('[ParserService] parse', 'vin', vin);
            return Promise.resolve({ vin: vin, data: domParsed });
        });
    }
};
ParserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __metadata("design:paramtypes", [Object])
], ParserService);
exports.ParserService = ParserService;
//# sourceMappingURL=parser.service.js.map