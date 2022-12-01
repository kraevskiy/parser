import { IParserService } from './parser.service.interface';
import { IParseSuccess, IParseError, IParseTypeTable, IParseTypeTableContent, TParseData } from './parse.type';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import constants, { ERROR_TEXT_IN_DOM } from './constants';
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

	parseDom(stringToGenDom: string): TParseData | string {
		const dom = new JSDOM(stringToGenDom);
		const document = dom.window.document;
		const isError = document.querySelector(constants.errorSelector);
		if(isError && isError.innerHTML === ERROR_TEXT_IN_DOM) {
			return ERROR_TEXT_IN_DOM;
		} else {
			const tablesDOM = [...document.querySelectorAll(constants.tablesSelector)];
			const result:TParseData = {
				tables: [],
				photos: [],
				allPhotos: null
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

			const linkPhotosAll = document.querySelector(constants.photosDownloadSelector) as HTMLAnchorElement;
			this.logger.log('[ ParseService ]: linkPhotosAll ' + linkPhotosAll)
			if(linkPhotosAll) {
				result.allPhotos = linkPhotosAll.href;
			}
			return result;
		}
	}

	async parse(vin: string): Promise<IParseSuccess | IParseError> {
		const content = await this.getWebsiteContent(vin);
		const domParsed = this.parseDom(content);

		if (typeof domParsed === 'string'){
			return Promise.resolve({vin, error: domParsed});
		} else {
			return Promise.resolve({vin, data: domParsed})
		}
	}
}
