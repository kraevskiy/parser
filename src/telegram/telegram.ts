import { Bot, Keyboard } from 'grammy';
import { Menu } from "@grammyjs/menu";
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';
import { IParserService } from '../parser/parser.service.interface';
import texts from './texts';
import { IParseType } from '../parser/parse.type';
import { getMarkdownAfterParse } from './helpers';

@injectable()
export class Telegram {
	bot: Bot;
	menu: Menu;
	// keyboard: Keyboard;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ParserService) private parseService: IParserService,
	) {
		this.bot = new Bot(this.configService.get('TELEGRAM_BOT_TOKEN'));
		this.menu = this.initMenu();
		// this.keyboard = this.initKeyboard();
	}

	start() {
		this.bot.command('start', async (ctx) => {
			await ctx.reply(texts.hi);
			await ctx.reply(texts.do, { reply_markup: this.menu })
		});
	}

	help() {
		this.bot.command('help', async (ctx) => await ctx.reply(texts.do, { reply_markup: this.menu }));
	}

	async sendMarkdownTemplate(chat_id: number | string, data: IParseType): Promise<void> {
		await this.bot.api.sendMessage(chat_id, getMarkdownAfterParse(data), {
			parse_mode: 'HTML'
		});
	}

	async sendMediaGroup(chat_id: number | string, data: IParseType): Promise<void> {
		const promises = []
		const chunkSize = 10;
		for (let i = 0; i < data.data.photos.length; i += chunkSize) {
			const chunk = data.data.photos.slice(i, i + chunkSize);
			promises.push(this.bot.api.sendMediaGroup(chat_id, chunk.map(p => ({type: 'photo', media: p}))))
		}
		await Promise.all(promises)
			.finally(async () => {
				await this.bot.api.sendMessage(chat_id, texts.done);
				await this.bot.api.sendMessage(chat_id, texts.pasteVin);
			})
		;
	}

	message() {
		this.bot.on("message", async (ctx) => {
			const message = ctx.message;
			if(message.text?.length !== 17) {
				await ctx.reply(texts.errorVin);
			} else {
				await ctx.reply(texts.waitPls);
				const res = await this.parseService.parse(message.text);
				await this.sendMarkdownTemplate(message.chat.id, res);
				await ctx.reply(texts.waitPhotos);
				await this.sendMediaGroup(message.chat.id, res);
			}
		});
	}

	initKeyboard() {
		return new Keyboard()
			.text("Give me information about my car by VIN").row()
			.resized();
	}

	initMenu() {
		return new Menu("my-menu-identifier")
			.text(texts.infoByVin, (ctx) => ctx.reply(texts.pasteVin)).row()
	}


	init() {
		this.bot.use(this.menu);
		this.start();
		this.message();
		this.help();
		this.bot.start({
			onStart: () => this.logger.log('[Telegram] start')
		})
			.catch(e => {
				console.log('bot');
				this.logger.error('[Telegram] error')
			})
	}

	close() {
		process.once('SIGINT', () => this.bot.stop());
		process.once('SIGTERM', () => this.bot.stop());
	}
}

