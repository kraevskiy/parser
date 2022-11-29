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
Object.defineProperty(exports, "__esModule", { value: true });
exports.boot = exports.appBindings = void 0;
const app_1 = require("./app");
const logger_service_1 = require("./logger/logger.service");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const config_service_1 = require("./config/config.service");
const parser_controller_1 = require("./parser/parser.controller");
const parser_service_1 = require("./parser/parser.service");
const exception_filter_1 = require("./errors/exception.filter");
exports.appBindings = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.ILogger).to(logger_service_1.LoggerService).inSingletonScope();
    bind(types_1.TYPES.ConfigService).to(config_service_1.ConfigService).inSingletonScope();
    bind(types_1.TYPES.ParserController).to(parser_controller_1.ParserController).inSingletonScope();
    bind(types_1.TYPES.ParserService).to(parser_service_1.ParserService).inSingletonScope();
    bind(types_1.TYPES.ExceptionFilter).to(exception_filter_1.ExceptionFilter);
    bind(types_1.TYPES.Application).to(app_1.App);
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const appContainer = new inversify_1.Container();
        appContainer.load(exports.appBindings);
        const app = appContainer.get(types_1.TYPES.Application);
        yield app.init();
        return { appContainer, app };
    });
}
exports.boot = bootstrap();
//# sourceMappingURL=index.js.map