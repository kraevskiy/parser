"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
class AuthGuard {
    execute(req, res, next) {
        if (req.user) {
            return next();
        }
        res.status(401).send({ error: 'Auth error' });
    }
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map