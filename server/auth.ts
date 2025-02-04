import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { users, type User } from "@db/schema";
import { db, pool } from "@db";
import { eq } from "drizzle-orm";
import { fromZodError } from "zod-validation-error";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      isAdmin: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);
const PostgresSessionStore = connectPg(session);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

async function getUserByUsername(username: string) {
  return db.select().from(users).where(eq(users.username, username)).limit(1);
}

// Middleware to check if user is admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function setupAuth(app: Express) {
  const store = new PostgresSessionStore({ pool, createTableIfMissing: true });
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID!,
    resave: false,
    saveUninitialized: false,
    store,
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const [user] = await getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    done(null, user);
  });

  // Admin routes
  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    const { username, password, isAdmin } = req.body;

    const [existingUser] = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const [user] = await db
      .insert(users)
      .values({
        username,
        password: await hashPassword(password),
        isAdmin: isAdmin || false,
      })
      .returning();

    res.status(201).json(user);
  });

  // Regular auth routes
  app.post("/api/register", async (req, res, next) => {
    const { username, password } = req.body;

    const [existingUser] = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const [user] = await db
      .insert(users)
      .values({
        username,
        password: await hashPassword(password),
        isAdmin: false,
      })
      .returning();

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Create initial admin user if none exists
  createInitialAdmin();
}

async function createInitialAdmin() {
  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.isAdmin, true))
    .limit(1);

  if (!existingAdmin) {
    const adminPassword = "admin123"; // You should change this in production
    await db.insert(users).values({
      username: "admin",
      password: await hashPassword(adminPassword),
      isAdmin: true,
    });
    console.log("Created initial admin user (username: admin, password: admin123)");
  }
}