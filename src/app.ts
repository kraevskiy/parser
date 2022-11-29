import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import 'reflect-metadata';
import { json } from 'body-parser';
import { AuthMiddleware } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';
import { ParserController } from './parser/parser.controller';
import { webhookCallback } from 'grammy'
import { Telegram } from './telegram/telegram';
import { bot } from './telegram/bot';

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ParserController) private parserController: ParserController,
		@inject(TYPES.Telegram) private telegram: Telegram,
	) {
		this.app = express();
		this.port = process.env.PORT || 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('AUTH_JWT_TOKEN'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
		this.app.use('/telegram', webhookCallback(bot, 'express'))
	}

	useRoutes(): void {
		this.app.use('/parser', this.parserController.router);
		this.app.use('/', (req, res) => {
			res.json({ message: 'hello' });
		});
	}


	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.server = this.app.listen(this.port, async () => {
			this.logger.log(`Server start http://localhost:${this.port}`);
			if(process.env.NODE_ENV === 'production') {
				console.log(1111111);
				await bot.api.setWebhook('https://parser-ten.vercel.app/telegram');
			}
		});

	}

	public close(): void {
		this.server.close();
	}
}
