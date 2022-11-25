import { NextFunction, Response, Request } from "express";

export interface IParserController {
	parse(req: Request, res: Response, next: NextFunction): void;
}
