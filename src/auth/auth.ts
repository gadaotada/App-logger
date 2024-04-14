import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { poolConn } from "../database/conn";
import { RowDataPacket } from "mysql2";
import dotenv from 'dotenv';
dotenv.config();

const jwt_secret: string = process.env.JWT_SECRET ?? "secret";

function createJWTtoken (id: number, username: string) {
  const token = jwt.sign({ id: id, username: username }, jwt_secret, { expiresIn: '13d' });
  return token;
};

function verifyJWTtoken (token: string): string | jwt.JwtPayload | null {
  try {
    const decoded = jwt.verify(token, jwt_secret);
    return decoded;
  } catch (err) {
    return null;
  }
};

export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username or password missing" });
    }
    const pool = await poolConn();
    if (!pool) {
        return res.status(500).json({ error: "Database connection failed" });
    };

    const [user] = await pool.query<RowDataPacket[]>("SELECT id, username FROM users WHERE username = ? AND password = ? LIMIT 1", [username, password]);
    if (user.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
    };

    const token = createJWTtoken(user[0].id, user[0].username);
    if (!token) {
        return res.status(500).json({ error: "Failed to generate token" });
    };

    res.cookie("auth-choco-token", token, { httpOnly: true, secure: false, path: '/' });
    res.redirect('/admin');
};

export async function logoutUser(res: Response) {
    res.clearCookie("auth-choco-token");
    res.redirect('/');
};

export async function checkLogin(req: Request, res: Response, path: string): Promise<boolean | void> {
    const token = req.cookies["auth-choco-token"];
    if (!token) {
        return false;
    };
    const decoded = verifyJWTtoken(token);
    if (!decoded) {
        res.clearCookie("auth-choco-token");
        return false;
    };
    
    res.redirect(path);
    return true;
};

export async function authMiddleware(req: Request, res: Response, next: Function) {
    const token = req.cookies["auth-choco-token"];
    if (!token) {
        return res.status(403).json({ error: "Forbidden" });
    };
    const decoded = verifyJWTtoken(token);
    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
    };
    next();
};