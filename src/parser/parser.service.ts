import { IParserService } from './parser.service.interface';
import { IParseType, IParseTypeTable, IParseTypeTableContent, TParseData } from './parse.type';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import constants from './constants';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch-commonjs';

@injectable()
export class ParserService implements IParserService {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
	}

	async getWebsiteContent(vin: string): Promise<string> {
		const content = await fetch(constants.url(vin));
		return content.text();
	}

	parseDom(stringToGenDom: string): TParseData {
		const dom = new JSDOM(stringToGenDom);
		const document = dom.window.document;

		const tablesDOM = [...document.querySelectorAll(constants.tablesSelector)];
		const result:TParseData = {
			tables: [],
			photos: []
		}

		tablesDOM.forEach(dom => {
			const tableData: IParseTypeTable = {
				title: '',
				content: []
			};
			const titleDom = dom.querySelector('h2');
			if(titleDom) {
				tableData.title = titleDom.innerHTML;
			}

			const trDom = [...dom.querySelectorAll('table tr')];
			trDom.forEach(tr => {
				const trRes: IParseTypeTableContent = {
					name: '',
					value: ''
				}
				const tdDom = [...tr.querySelectorAll('td')];
				if(tdDom.length === 2) {
					trRes.name = tdDom[0].innerHTML;
					trRes.value = tdDom[1].innerHTML;
				}
				tableData.content.push(trRes);
			})
			result.tables.push(tableData);
		});

		const photosDOM = [...document.querySelectorAll(constants.photosSelector)] as HTMLAnchorElement[];
		photosDOM.forEach(photo => {
			result.photos.push(photo.href)
		})

		return result;
	}

	async parse(vin: string): Promise<IParseType> {
		const content = await this.getWebsiteContent(vin);
		const domParsed = this.parseDom(content);

		this.logger.log('[ParserService] parse', 'vin', vin);
		return Promise.resolve({vin: vin, data: domParsed});
	}

}
