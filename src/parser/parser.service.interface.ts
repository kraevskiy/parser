import { IParseError, IParseSuccess } from './parse.type';

export interface IParserService {
	parse: (vin: string) => Promise<IParseError | IParseSuccess>
}
