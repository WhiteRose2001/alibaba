import session, { Store } from "express-session";

export const sessionName = "logged_in_session";

export const cookieParams = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: <const>"lax",
};

export function setupSession(sessionStore: Store) {
  return session({
    name: sessionName,
    secret: process.env.SESSION_SECRET!,
    store: sessionStore ?? undefined,
    resave: false,
    saveUninitialized: false,
    cookie: { ...cookieParams, maxAge: 24 * 60 * 60 * 1000 },
  });
}
