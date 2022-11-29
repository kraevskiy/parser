"use strict";
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
exports.bot = void 0;
const grammy_1 = require("grammy");
const dotenv_1 = require("dotenv");
const texts_1 = __importDefault(require("./texts"));
const menu_1 = require("@grammyjs/menu");
const helpers_1 = require("./helpers");
const axios_1 = __importDefault(require("axios"));
(0, dotenv_1.config)();
exports.bot = new grammy_1.Bot(process.env.TELEGRAM_BOT_TOKEN);
const menu = new menu_1.Menu('my-menu-identifier')
    .text(texts_1.default.infoByVin, (ctx) => ctx.reply(texts_1.default.pasteVin)).row();
exports.bot.use(menu);
exports.bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply(texts_1.default.hi);
    yield ctx.reply(texts_1.default.do, { reply_markup: menu });
}));
const sendMarkdownTemplate = (chat_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.bot.api.sendMessage(chat_id, (0, helpers_1.getMarkdownAfterParse)(data), {
        parse_mode: 'HTML'
    });
});
const sendMediaGroup = (chat_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    const chunkSize = 10;
    for (let i = 0; i < data.data.photos.length; i += chunkSize) {
        const chunk = data.data.photos.slice(i, i + chunkSize);
        promises.push(exports.bot.api.sendMediaGroup(chat_id, chunk.map(p => ({ type: 'photo', media: p }))));
    }
    yield Promise.all(promises)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield exports.bot.api.sendMessage(chat_id, texts_1.default.done);
        yield exports.bot.api.sendMessage(chat_id, texts_1.default.pasteVin);
    }));
});
const parseInfo = (vin) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get('https://parser-ten.vercel.app/parser/parse', {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            'content-type': 'application/json'
        },
        data: {
            vin
        }
    });
    if (res.data) {
        return res.data;
    }
    return null;
});
exports.bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const message = ctx.message;
    if (((_a = message.text) === null || _a === void 0 ? void 0 : _a.length) !== 17) {
        yield ctx.reply(texts_1.default.errorVin);
    }
    else {
        yield ctx.reply(texts_1.default.waitPls);
        const res = yield parseInfo(message.text);
        if (res) {
            yield sendMarkdownTemplate(message.chat.id, res);
            yield ctx.reply(texts_1.default.waitPhotos);
            yield sendMediaGroup(message.chat.id, res);
        }
        else {
            yield ctx.reply('err');
        }
    }
}));
//# sourceMappingURL=bot.js.map