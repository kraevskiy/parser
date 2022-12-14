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

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ParserController) private parserController: ParserController,
	) {
		this.app = express();
		this.port = process.env.PORT || 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('AUTH_JWT_TOKEN'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/parser', this.parserController.router);
		// this.app.use('/tel', webhookCallback(bot, 'express'))
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
				// await bot.api.setWebhook('https://parser-ten.vercel.app/tel');
			}
		});

	}

	public close(): void {
		this.server.close();
	}
}
