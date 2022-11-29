import { Bot } from 'grammy';
import { config } from 'dotenv';
import texts from './texts';
import { Menu } from '@grammyjs/menu';
import { IParseType } from '../parser/parse.type';
import { getMarkdownAfterParse } from './helpers';
import axios from 'axios';

config();
console.log('bot');
export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN as string);

const menu = new Menu('my-menu-identifier')
	.text(texts.infoByVin, (ctx) => ctx.reply(texts.pasteVin)).row()

bot.use(menu);

bot.command('start', async (ctx) => {
	await ctx.reply(texts.hi);
	await ctx.reply(texts.do, {reply_markup: menu})
});

const sendMarkdownTemplate = async (chat_id: number | string, data: IParseType): Promise<void> => {
	await bot.api.sendMessage(chat_id, getMarkdownAfterParse(data), {
		parse_mode: 'HTML'
	});
}

const sendMediaGroup = async (chat_id: number | string, data: IParseType): Promise<void> => {
	const promises = []
	const chunkSize = 10;
	for (let i = 0; i < data.data.photos.length; i += chunkSize) {
		const chunk = data.data.photos.slice(i, i + chunkSize);
		promises.push(bot.api.sendMediaGroup(chat_id, chunk.map(p => ({type: 'photo', media: p}))))
	}
	await Promise.all(promises)
		.finally(async () => {
			await bot.api.sendMessage(chat_id, texts.done);
			await bot.api.sendMessage(chat_id, texts.pasteVin);
		});
}

const parseInfo = async (vin: string): Promise<IParseType | null> => {
	const res = await axios.get('https://parser-ten.vercel.app/parser/parse', {
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
}

bot.on('message', async (ctx) => {
	const message = ctx.message;
	if (message.text?.length !== 17) {
		await ctx.reply(texts.errorVin);
	} else {
		await ctx.reply(texts.waitPls);
		const res = await parseInfo(message.text);
		if (res) {
			await sendMarkdownTemplate(message.chat.id, res);
			await ctx.reply(texts.waitPhotos);
			await sendMediaGroup(message.chat.id, res);
		} else {
			await ctx.reply('err');
		}
	}
});
