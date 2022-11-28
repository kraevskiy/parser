import { IParseType } from '../parser/parse.type';

export const getMarkdownAfterParse = (data: IParseType): string => {
	const mark = `<b>VIN: </b>${data.vin}${data.data.tables.map(table => `

<u><b>${table.title}:</b></u> ${table.content.map(tr => `
${tr.name}: <i>${tr.value}</i>`)}`)}`
	return mark;
}
