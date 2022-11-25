import { NextFunction, Response, Request } from 'express';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(
		private secret: string,
	) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			if(req.headers.authorization === this.secret){
				req.user = 'authorized';
				next();
			} else {
				next();
			}
		} else {
			next();
		}
	}
}
