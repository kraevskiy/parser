import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		console.log(process.env.NODE_ENV);
		console.log(process.env.NODE_ENV === 'production');
		if(process.env.NODE_ENV === 'production') {
			this.config = process.env as DotenvParseOutput;
		} else if (result.error) {
			this.logger.error(`[ConfigService] File .env parse error or didn't find this file`);
		} else {
			this.logger.log('[ConfigService] Configuration .end downloaded');
			this.config = result.parsed as DotenvParseOutput;
		}

	}

	get(key: string): string {
		return this.config[key];
	}
}
