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
exports.Telegram = void 0;
const grammy_1 = require("grammy");
const menu_1 = require("@grammyjs/menu");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const texts_1 = __importDefault(require("./texts"));
const helpers_1 = require("./helpers");
let Telegram = class Telegram {
    constructor(logger, configService, parseService) {
        this.logger = logger;
        this.configService = configService;
        this.parseService = parseService;
        this.bot = new grammy_1.Bot(this.configService.get('TELEGRAM_BOT_TOKEN'));
        this.menu = this.initMenu();
    }
    start() {
        this.bot.command('start', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.reply(texts_1.default.hi);
            yield ctx.reply(texts_1.default.do, { reply_markup: this.menu });
        }));
    }
    help() {
        this.bot.command('help', (ctx) => __awaiter(this, void 0, void 0, function* () { return yield ctx.reply(texts_1.default.do, { reply_markup: this.menu }); }));
    }
    sendMarkdownTemplate(chat_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.api.sendMessage(chat_id, (0, helpers_1.getMarkdownAfterParse)(data), {
                parse_mode: 'HTML'
            });
        });
    }
    sendMediaGroup(chat_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const chunkSize = 10;
            for (let i = 0; i < data.data.photos.length; i += chunkSize) {
                const chunk = data.data.photos.slice(i, i + chunkSize);
                promises.push(this.bot.api.sendMediaGroup(chat_id, chunk.map(p => ({ type: 'photo', media: p }))));
            }
            yield Promise.all(promises)
                .finally(() => __awaiter(this, void 0, void 0, function* () {
                yield this.bot.api.sendMessage(chat_id, texts_1.default.done);
                yield this.bot.api.sendMessage(chat_id, texts_1.default.pasteVin);
            }));
        });
    }
    message() {
        this.bot.on("message", (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = ctx.message;
            if (((_a = message.text) === null || _a === void 0 ? void 0 : _a.length) !== 17) {
                yield ctx.reply(texts_1.default.errorVin);
            }
            else {
                yield ctx.reply(texts_1.default.waitPls);
                const res = yield this.parseService.parse(message.text);
                yield this.sendMarkdownTemplate(message.chat.id, res);
                yield ctx.reply(texts_1.default.waitPhotos);
                yield this.sendMediaGroup(message.chat.id, res);
            }
        }));
    }
    initKeyboard() {
        return new grammy_1.Keyboard()
            .text("Give me information about my car by VIN").row()
            .resized();
    }
    initMenu() {
        return new menu_1.Menu("my-menu-identifier")
            .text(texts_1.default.infoByVin, (ctx) => ctx.reply(texts_1.default.pasteVin)).row();
    }
    init() {
        this.bot.use(this.menu);
        this.start();
        this.message();
        this.help();
        this.bot.start({
            onStart: () => this.logger.log('[Telegram] start')
        });
        this.bot.catch(e => {
            this.logger.error('[Telegram] error', e);
        });
        return this.bot;
    }
    close() {
        process.once('SIGINT', () => this.bot.stop());
        process.once('SIGTERM', () => this.bot.stop());
    }
};
Telegram = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ParserService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], Telegram);
exports.Telegram = Telegram;
//# sourceMappingURL=telegram.js.map