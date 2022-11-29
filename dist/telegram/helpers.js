"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarkdownAfterParse = void 0;
const getMarkdownAfterParse = (data) => {
    const mark = `<b>VIN: </b>${data.vin}${data.data.tables.map(table => `

<u><b>${table.title}:</b></u> ${table.content.map(tr => `
${tr.name}: <i>${tr.value}</i>`)}`)}`;
    return mark;
};
exports.getMarkdownAfterParse = getMarkdownAfterParse;
//# sourceMappingURL=helpers.js.map