export type IParseTypeTableContent = {
	name: string;
	value: string;
}

export type IParseTypeTable = {
	title: string;
	content: IParseTypeTableContent[];
}

export type TParseData = {
	tables: IParseTypeTable[];
	photos: string[];
}

export interface IParseType {
	vin: string;
	data: TParseData;
}
