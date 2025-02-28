import { Request } from 'express';
import { Session } from 'express-session';
interface AuthenticatedSession extends Session {
    access_token: string;
}
export default interface AuthenticatedRequest extends Request {
    session: AuthenticatedSession;
}
