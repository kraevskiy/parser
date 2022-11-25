import { IParseType } from './parse.type';

export interface IParserService {
	parse: (vin: string) => Promise<IParseType>
}
