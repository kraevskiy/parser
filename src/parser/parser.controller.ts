import { NextFunction, Response, Request } from 'express';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../types';
import { IParserController } from './parser.controller.interface';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';
import { IParserService } from './parser.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ParseDto } from './dto/parse.dto';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class ParserController extends BaseController implements IParserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ParserService) private parserService: IParserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/parse',
				method: 'post',
				func: this.parse,
				middlewares: [new AuthGuard(), new ValidateMiddleware(ParseDto)]
			},
		])
	}

	async parse({body}: Request<{}, {}, ParseDto>, res: Response, next: NextFunction): Promise<void> {
		this.loggerService.log('[ParseController] parse');
		const result = await this.parserService.parse(body.vin);
		this.ok(res, result)
	}
}
