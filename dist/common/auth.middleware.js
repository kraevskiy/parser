"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
class AuthMiddleware {
    constructor(secret) {
        this.secret = secret;
    }
    execute(req, res, next) {
        if (req.headers.authorization) {
            if (req.headers.authorization === this.secret) {
                req.user = 'authorized';
                next();
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map