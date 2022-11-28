import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IParserController } from './parser/parser.controller.interface';
import { ParserController } from './parser/parser.controller';
import { IParserService } from './parser/parser.service.interface';
import { ParserService } from './parser/parser.service';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { Telegram } from './telegram/telegram';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IParserController>(TYPES.ParserController).to(ParserController).inSingletonScope();
	bind<IParserService>(TYPES.ParserService).to(ParserService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<App>(TYPES.Application).to(App);
	bind<Telegram>(TYPES.Telegram).to(Telegram);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	const bot = appContainer.get<Telegram>(TYPES.Telegram);
	await bot.init();
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
