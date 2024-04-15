import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface IRequest extends Request {
  body: {
    user?: { id: string };
  };
}

const authlogout = (req: IRequest, res: Response, next: NextFunction) => {
  console.log(req.headers);
  const authHeader = req.header("Authorization");
  let token=''

  // Handle both prefixed and unprefixed tokens:
  if (authHeader) {
    if (authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else if (authHeader.startsWith("JWT ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
  }

  if (token == null) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_REFRESH, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.body.user = user as { id: string, _id: string };
    next();
  });
};








export default authlogout;
