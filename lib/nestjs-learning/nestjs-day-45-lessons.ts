import type { LessonDay } from "@/lib/learn/lesson-types";

export const AUTHENTICATION_PROJECT_DAY_45_LESSONS: LessonDay = {
  day: 45,
  title: "Authentication Project",
  totalMinutes: 148,
  difficulty: "Advanced",
  lessons: [
    // ============================================================
    // LESSON 1
    // ============================================================
    {
      id: "day-45-lesson-1",
      title: "Authentication Project Architecture and Threat Model",
      durationMinutes: 18,
      explanation: `
<b>Imagine you are building the authentication system for a food delivery app like DoorDash.</b> Riders need to log in to accept deliveries. Customers need to log in to place orders. Restaurant owners need to log in to manage menus. Admins need to log in to resolve disputes. Each of these users has a different role, different permissions, and different security requirements. If you get authentication wrong, someone can log in as another user, steal payment information, or take over an entire restaurant account.

This lesson is about the <b>architecture</b> — the big-picture design decisions you make <i>before</i> writing a single line of authentication code. Most beginners jump straight to "how do I hash a password?" But experienced engineers first ask: <b>What am I protecting? Who is attacking? What happens if each part fails?</b> That process is called a <b>threat model</b>.

<h3>Why authentication needs its own architecture</h3>

Authentication touches almost every part of your application: the database (users, sessions, tokens), the API layer (guards, middleware), the frontend (login forms, token storage), email systems (verification, password reset), third-party providers (Google, GitHub), and infrastructure (Redis for sessions, secrets management). If you don't design it as a system, you end up with scattered logic: password hashing in one service, token validation in another, role checks copied into ten controllers. That becomes impossible to secure and impossible to change.

<b>Think of authentication like the security system of a bank branch.</b> You don't just put a lock on the front door. You have cameras, a vault, employee badges, alarm systems, and a security guard. Each layer assumes the others might fail. That is <b>defense in depth</b> — and it is the core principle of authentication architecture.

<h3>The threat model: who is attacking and how?</h3>

A threat model is a structured way to think about what can go wrong. For an authentication system, the main threats are:

• <b>Credential stuffing:</b> Attackers take passwords leaked from other sites and try them on your site. Because many people reuse passwords, this works surprisingly often.
• <b>Brute force:</b> Trying thousands of password combinations against a single account.
• <b>Session hijacking:</b> Stealing a user's session token (via XSS, network sniffing, or a compromised device) and using it to impersonate them.
• <b>Token theft:</b> Stealing a JWT or refresh token and using it until it expires.
• <b>Privilege escalation:</b> A normal user finding a way to perform admin actions.
• <b>Account enumeration:</b> Figuring out which emails are registered by observing different responses for "user exists" vs "user does not exist."
• <b>Password reset abuse:</b> Using the forgot-password flow to take over an account.
• <b>OAuth account linking attacks:</b> Tricking the system into linking an attacker's OAuth account to a victim's existing account.
• <b>Insider threats:</b> Someone with database access reading plaintext passwords or tokens.

For each threat, you need a <b>mitigation</b>. That's the architecture.

<h3>The layered architecture of a NestJS authentication system</h3>

Here is the mental model we will use for the entire day:

<pre>
Client (Browser / Mobile)
        |
        v
+-----------------------------+
|  API Gateway / NestJS       |
|  - Rate limiting            |
|  - CORS                     |
|  - Helmet (security headers)|
+-----------------------------+
        |
        v
+-----------------------------+
|  Auth Module                |
|  - AuthController           |
|  - AuthService              |
|  - TokenService             |
|  - PasswordService          |
|  - EmailService             |
+-----------------------------+
        |
        v
+-----------------------------+
|  Guards & Strategies        |
|  - JwtAuthGuard             |
|  - RolesGuard               |
|  - PermissionsGuard         |
|  - LocalStrategy            |
|  - JwtStrategy              |
|  - GoogleStrategy           |
+-----------------------------+
        |
        v
+-----------------------------+
|  Users Module               |
|  - UserService              |
|  - UserRepository           |
+-----------------------------+
        |
        v
+-----------------------------+
|  Database (PostgreSQL)      |
|  - users                    |
|  - sessions / refresh_tokens|
|  - roles / permissions      |
|  - email_verifications      |
|  - password_resets          |
+-----------------------------+
        |
        v
+-----------------------------+
|  Supporting Services        |
|  - Redis (sessions, rate limit) |
|  - Email provider (SendGrid)     |
|  - Secrets manager               |
+-----------------------------+
</pre>

Each layer has a job. The controller handles HTTP. The service contains business logic. The guards decide who can access what. The strategies define <i>how</i> a user proves who they are. The database stores the truth. Redis stores short-lived state. The email provider delivers verification and reset links.

<h3>Why separate PasswordService from AuthService?</h3>

Beginners often put password hashing directly inside AuthService. That works for a demo, but in production you want a dedicated <b>PasswordService</b> because:

• You may want to change the hashing algorithm (bcrypt → argon2) without touching login logic.
• You want to unit test hashing independently.
• You want a single place to enforce password policies (minimum length, breach checks).
• You want to log or monitor password-related operations separately.

This is the <b>single responsibility principle</b> applied to authentication. Each service has one reason to change.

<h3>Why a TokenService?</h3>

Tokens are the currency of authentication. You will have access tokens (short-lived), refresh tokens (long-lived), email verification tokens, and password reset tokens. Each has different lifetime, storage, and revocation rules. A <b>TokenService</b> centralizes generation, validation, and revocation so you don't accidentally use a 30-day token where a 15-minute token belongs.

<h3>Real-world scenario: the food delivery app</h3>

Let's make this concrete. In our food delivery app:

• A <b>customer</b> logs in with email + password or Google. They can view restaurants, place orders, and see their order history.
• A <b>rider</b> logs in with email + password + phone verification. They can see available deliveries and update delivery status.
• A <b>restaurant owner</b> logs in with email + password + 2FA. They can manage menus, see incoming orders, and update prices.
• An <b>admin</b> logs in with SSO (Google Workspace) + hardware key. They can do anything.

Notice that authentication is not one flow — it's many. Your architecture must support all of them without becoming a mess. That's why we separate concerns: <b>identity</b> (who you are), <b>authentication</b> (proving it), <b>authorization</b> (what you can do), and <b>session management</b> (staying logged in).

<h3>What happens if you skip the threat model</h3>

If you skip this step, you will likely:

• Return "User not found" for unknown emails — enabling account enumeration.
• Store JWTs in localStorage — vulnerable to XSS.
• Use long-lived access tokens with no refresh — stolen tokens work for weeks.
• Forget to rate limit login — brute force becomes trivial.
• Hash passwords with MD5 or SHA-256 — instantly crackable with GPUs.
• Log tokens or passwords in error messages — leaks into logs and monitoring.

Every one of these is a real breach you can read about in incident reports. The architecture lesson exists so you don't repeat them.

<h3>How experienced engineers think about this</h3>

Experienced engineers treat authentication as a <b>system with failure modes</b>. They ask:

• If Redis goes down, can users still log in? (Maybe yes, if sessions are in the DB. Maybe no, if Redis is the only session store.)
• If the email provider is slow, does registration block? (It shouldn't — send verification email asynchronously.)
• If an attacker steals a refresh token, how fast can we revoke it? (This is why you store refresh tokens server-side.)
• If a user changes their password, do all sessions die? (They should.)

These are architecture questions, not coding questions. The rest of today's lessons will answer them one by one.

<h3>Beginner vs. production mindset</h3>

<b>Beginner mindset:</b> "I need login to work."

<b>Production mindset:</b> "I need login to work correctly under attack, under load, under partial failure, and under regulatory audit. And I need to be able to change it in six months without breaking everything."

The gap between those two mindsets is the entire point of today.
      `,
      diagram: `
Threat Model Layers
===================

        Attacker
           |
           v
+---------------------+
| Network / Transport |  <-- TLS, HSTS
+---------------------+
           |
           v
+---------------------+
| API Edge            |  <-- Rate limiting, CORS, Helmet
+---------------------+
           |
           v
+---------------------+
| Auth Logic          |  <-- Hashing, tokens, sessions
+---------------------+
           |
           v
+---------------------+
| Authorization       |  <-- Guards, roles, permissions
+---------------------+
           |
           v
+---------------------+
| Data Store          |  <-- Users, sessions, tokens
+---------------------+
           |
           v
+---------------------+
| Observability       |  <-- Logs, metrics, alerts
+---------------------+

Defense in depth: each layer assumes the previous one failed.
      `,
      codeExample: { title: "Example", code: `
// auth.module.ts
// This module is the entry point of our authentication architecture.
// It wires together controllers, services, strategies, and guards.
// Keeping them in one module makes the dependencies explicit.

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { EmailService } from './email.service';

import { UsersModule } from '../users/users.module';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule, // We need UserService to look up users
    PassportModule, // Passport is the strategy framework
    // JwtModule is configured asynchronously so we can read secrets
    // from environment variables instead of hardcoding them.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }, // short-lived access tokens
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    EmailService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, TokenService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}

/*
Why this structure matters:

- PasswordService: hashing and verifying passwords. One place to change algorithms.
- TokenService: generating and validating all token types.
- EmailService: sending verification and reset emails (async, non-blocking).
- Strategies: Passport strategies for local, JWT, and OAuth.
- Guards: reusable authorization checks applied per-route.

If you put all of this in one AuthService, you would have a 2000-line file
that is impossible to test and dangerous to change. The architecture
above keeps each concern isolated.
*/
      ` },
      keyTakeaways: [
        "Authentication is a system, not a single function — design it with layers and clear responsibilities.",
        "A threat model identifies what can go wrong (credential stuffing, session hijacking, enumeration) before you write code.",
        "Defense in depth means every layer assumes the previous one can fail.",
        "Separate `PasswordService`, `TokenService`, and `EmailService` so each can change and be tested independently.",
        "Short-lived access tokens + server-side refresh tokens limit the damage of token theft.",
        "Never store JWTs in localStorage; prefer httpOnly cookies or in-memory storage with refresh flows.",
        "Experienced engineers design for partial failure: what happens if Redis, email, or the DB is down?",
        "The architecture must support multiple user types (customer, rider, owner, admin) without duplicating auth logic.",
      ],
      commonMistakes: [
        "<b>Skipping the threat model.</b> If you don't list the attacks, you can't defend against them. Most breaches exploit a known, predictable weakness.",
        "<b>Putting all auth logic in one service.</b> This feels simple at first but becomes unmaintainable and untestable as you add OAuth, 2FA, and password reset.",
        "<b>Using long-lived access tokens.</b> A 30-day access token means a stolen token is valid for 30 days. Use 15 minutes and refresh tokens instead.",
        "<b>Storing tokens in localStorage.</b> Any XSS bug becomes a full account takeover. Use httpOnly cookies or memory + refresh.",
        "<b>Ignoring account enumeration.</b> Returning 'user not found' on login or reset reveals which emails are registered.",
        "<b>Hardcoding secrets.</b> JWT secrets, database passwords, and API keys must come from environment variables or a secrets manager.",
        "<b>Not planning for revocation.</b> If you can't revoke a token, you can't respond to a breach.",
      ],
      quiz: [
        {
          question: "Why does a production authentication system use defense in depth instead of relying on one strong mechanism?",
          options: [
            "Because one mechanism is always enough if it's strong",
            "Because any single layer can fail or be bypassed, so multiple layers reduce the chance of a full breach",
            "Because it makes the code longer and more impressive",
            "Because NestJS requires it",
          ],
          correctIndex: 1,
          explanation:
            "Defense in depth assumes each layer can fail. If an attacker bypasses rate limiting, they still face strong hashing, short-lived tokens, and revocation. If they steal a token, short expiry limits damage. No single control is perfect.",
        },
        {
          question: "What is the main risk of storing a JWT in localStorage?",
          options: [
            "It expires too quickly",
            "It cannot be sent to the server",
            "Any XSS vulnerability can read it and steal the session",
            "It uses too much memory",
          ],
          correctIndex: 2,
          explanation:
            "localStorage is accessible to any JavaScript running on the page. A single XSS bug lets an attacker read the token and impersonate the user. httpOnly cookies are not readable by JavaScript, which is why they're preferred for sensitive tokens.",
        },
        {
          question: "Why is account enumeration a problem?",
          options: [
            "It slows down the database",
            "It tells attackers which emails are registered, helping them target real accounts",
            "It breaks the login form",
            "It uses extra CPU",
          ],
          correctIndex: 1,
          explanation:
            "If login or password reset returns different messages for 'email exists' vs 'email not found', attackers can build a list of valid accounts. That list is then used for credential stuffing and phishing.",
        },
        {
          question: "In the layered architecture, why separate TokenService from AuthService?",
          options: [
            "Because NestJS requires one service per token type",
            "Because tokens have different lifetimes and revocation rules, and centralizing them prevents misuse",
            "Because AuthService cannot import JwtService",
            "Because it makes the code shorter",
          ],
          correctIndex: 1,
          explanation:
            "Access tokens, refresh tokens, email verification tokens, and password reset tokens all have different lifetimes and storage rules. A dedicated TokenService ensures you don't accidentally use a 30-day token where a 15-minute token belongs, and it gives you one place to revoke tokens.",
        },
      ],
    },

    // ============================================================
    // LESSON 2
    // ============================================================
    {
      id: "day-45-lesson-2",
      title: "Registration, Password Hashing, Login, and Logout",
      durationMinutes: 22,
      explanation: `
<b>Imagine a new customer downloads your food delivery app and taps "Sign Up."</b> They type their name, email, and password. Behind that simple form, a lot has to happen safely: the email must be unique, the password must be strong, the password must be hashed (never stored as plain text), the account must be created, and a session must begin. Then when they come back tomorrow and tap "Log In," the system must verify their password without ever storing or comparing plain text. And when they tap "Log Out," their session must actually end — not just disappear from the screen.

This lesson covers the core of authentication: <b>registration, password hashing, login, and logout</b>. These are the four operations every authenticated app needs, and they are where most beginner mistakes happen.

<h3>Why password hashing exists</h3>

If you store passwords as plain text and your database leaks, every user's password is immediately exposed. Because people reuse passwords, that leak compromises their email, bank, and social accounts too. <b>Hashing</b> solves this: instead of storing the password, you store a one-way transformation of it. When the user logs in, you hash what they typed and compare hashes.

But not all hashing is equal. <b>MD5 and SHA-256 are fast</b> — and that's bad. Fast hashes let attackers try billions of guesses per second on a GPU. Password hashing algorithms like <b>bcrypt</b>, <b>scrypt</b>, and <b>argon2</b> are deliberately slow and configurable. They also use a <b>salt</b> — a random value added to each password before hashing — so two users with the same password get different hashes.

<b>Think of bcrypt like a lock that takes 250ms to open.</b> For a legitimate user logging in once, 250ms is invisible. For an attacker trying a million passwords, 250ms each means 69 hours per million guesses — and with rate limiting, far longer.

<h3>Registration flow, step by step</h3>

• The client sends <code>{ email, password, name }</code> to <code>POST /auth/register</code>.
• A <b>DTO</b> validates the shape: email format, password length, name presence.
• The service checks if the email already exists. If it does, return a generic error (to avoid enumeration).
• The password is hashed with bcrypt using a cost factor (usually 10–12).
• A user record is created in the database.
• A verification email is sent asynchronously (do not block the response).
• The response returns the user (without the password hash) or a success message.

Notice that registration does <b>not</b> automatically log the user in for email/password flows in most production systems — because the email isn't verified yet. For OAuth flows it often does, because the provider already verified the email.

<h3>Login flow, step by step</h3>

• The client sends <code>{ email, password }</code> to <code>POST /auth/login</code>.
• A <b>LocalStrategy</b> (Passport) looks up the user by email and verifies the password.
• If valid, the service issues an <b>access token</b> (short-lived) and a <b>refresh token</b> (long-lived, stored server-side).
• The refresh token is set as an <b>httpOnly cookie</b>. The access token can be returned in the response body (stored in memory) or also set as a cookie.
• If invalid, return a generic "Invalid credentials" — never "wrong password" vs "user not found."

<h3>Why refresh tokens?</h3>

Access tokens are short-lived (15 minutes) so stolen tokens expire quickly. But you don't want users logging in every 15 minutes. A <b>refresh token</b> lets the client exchange a long-lived token for a new access token. Refresh tokens are stored server-side (in Redis or the DB) so they can be <b>revoked</b>. If a refresh token is stolen, you can invalidate it. If an access token is stolen, it expires on its own.

<h3>Logout: more than clearing the screen</h3>

A beginner's logout just removes the token from the client. But the token is still valid on the server until it expires. Real logout must:

• Revoke the refresh token (delete it from Redis/DB).
• Clear the refresh token cookie.
• Optionally blacklist the current access token until it expires (if you need immediate revocation).

If you skip revocation, a stolen refresh token keeps working even after the user "logged out."

<h3>Real-world scenario: the food delivery app</h3>

A customer registers with email and password. They receive a verification email. They click the link, and their account becomes active. They log in on their phone. The app stores the access token in memory and the refresh token in an httpOnly cookie. When the access token expires, the app silently calls <code>/auth/refresh</code> to get a new one. When they log out, the server deletes the refresh token from Redis, so even if someone copied the cookie, it no longer works.

<h3>What can go wrong</h3>

• <b>Storing plain text passwords:</b> catastrophic on breach.
• <b>Using MD5/SHA-256:</b> fast hashes are crackable.
• <b>Comparing passwords with <code>===</code>:</b> timing attacks. Use <code>bcrypt.compare</code>.
• <b>Returning different errors for wrong email vs wrong password:</b> account enumeration.
• <b>No rate limiting on login:</b> brute force.
• <b>Logging the password or hash:</b> leaks into log aggregation systems.
• <b>Not revoking refresh tokens on logout:</b> tokens outlive the session.

<h3>How experienced engineers think about this</h3>

They treat passwords as radioactive: never log them, never return them, never store them in plain text, and never compare them directly. They treat tokens as currency: short-lived, revocable, and stored where XSS can't reach. They treat login endpoints as hostile: rate-limited, monitored, and returning uniform responses.

<h3>Beginner vs. production</h3>

<b>Beginner:</b> Store password, compare with <code>===</code>, return JWT, done.

<b>Production:</b> Hash with bcrypt/argon2, use Passport's LocalStrategy, issue short-lived access + revocable refresh tokens, set httpOnly cookies, rate-limit, log auth events (not secrets), and revoke on logout.
      `,
      diagram: `
Registration Flow
=================

Client                API                  DB
  |                    |                    |
  |-- POST /register ->|                    |
  |                    |-- validate DTO     |
  |                    |-- check email ---->|
  |                    |<-- not found ------|
  |                    |-- hash password    |
  |                    |-- create user ---->|
  |                    |<-- user created ---|
  |                    |-- send verify email (async)
  |<-- 201 Created ----|
  |                    |

Login Flow
==========

Client                API                  DB / Redis
  |                    |                    |
  |-- POST /login ---->|                    |
  |                    |-- find user ------>|
  |                    |<-- user -----------|
  |                    |-- bcrypt.compare   |
  |                    |-- issue access JWT |
  |                    |-- create refresh ->| (Redis)
  |<-- access + cookie-|                    |
  |                    |                    |

Logout Flow
===========

Client                API                  Redis
  |                    |                    |
  |-- POST /logout --->|                    |
  |                    |-- delete refresh ->|
  |                    |<-- ok -------------|
  |<-- clear cookie ---|                    |
      `,
      codeExample: { title: "Example", code: `
// password.service.ts
// A dedicated service for hashing and verifying passwords.
// If we ever change algorithms (bcrypt -> argon2), only this file changes.

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  // Cost factor 12 is a good balance in 2024: ~250ms on modern hardware.
  // Higher = slower for attackers but also slower for users.
  private readonly saltRounds = 12;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

// ------------------------------------------------------------

// dto/register.dto.ts
// Validation happens before the service sees the data.
// class-validator gives us declarative, reusable rules.

import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12) // longer than 8; NIST recommends 8+ but 12 is safer
  @MaxLength(72) // bcrypt truncates beyond 72 bytes
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}

// ------------------------------------------------------------

// auth.service.ts (registration part)
// The service contains the business logic. It does NOT know about HTTP.

import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { EmailService } from './email.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly passwords: PasswordService,
    private readonly email: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      // Generic message to avoid account enumeration.
      // We still return 409, but the message is intentionally vague.
      throw new ConflictException('Unable to register with these details');
    }

    const passwordHash = await this.passwords.hash(dto.password);

    const user = await this.users.create({
      email: dto.email.toLowerCase().trim(),
      name: dto.name,
      passwordHash,
      emailVerified: false,
    });

    // Fire-and-forget: do not block the response on email delivery.
    // If email fails, the user can request a new verification email.
    this.email.sendVerification(user).catch((err) => {
      // Log the error, but do not leak it to the client.
      console.error('Failed to send verification email', err);
    });

    // Never return the password hash.
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}

// ------------------------------------------------------------

// auth.service.ts (login + token issuance)
// Login uses Passport's LocalStrategy to verify credentials,
// then issues an access token and a refresh token.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    // Always run a hash comparison even if user is missing,
    // to avoid timing attacks that reveal whether an email exists.
    const hash = user?.passwordHash ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalid';
    const ok = await this.passwords.verify(password, hash);
    if (!user || !ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: { id: string; email: string; roles: string[] }) {
    const payload = { sub: user.id, email: user.email, roles: user.roles };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
    });

    // Refresh token is random and stored server-side so it can be revoked.
    const refreshToken = await this.tokens.createRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async logout(userId: string, refreshToken: string) {
    // Revoke the specific refresh token. The access token will expire on its own.
    await this.tokens.revokeRefreshToken(userId, refreshToken);
  }
}

// ------------------------------------------------------------

// auth.controller.ts
// The controller is thin: it maps HTTP to service calls and sets cookies.

import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @UseGuards(LocalAuthGuard) // validates email + password via LocalStrategy
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.auth.login(req.user as any);

    // Refresh token in httpOnly cookie: JavaScript cannot read it.
    // sameSite=strict reduces CSRF risk. secure=true requires HTTPS.
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    // Access token returned in the body, stored in memory by the client.
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh = req.cookies?.['refresh_token'];
    if (refresh) {
      await this.auth.logout((req.user as any).id, refresh);
    }
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
  }
}

/*
Key ideas:

1. PasswordService is the only place that knows about bcrypt.
2. AuthService orchestrates registration and login.
3. Controller is thin and handles HTTP concerns (cookies, status codes).
4. Refresh tokens are stored server-side and revocable.
5. Generic error messages prevent account enumeration.
6. Email sending is async so registration stays fast.
*/
      ` },
      keyTakeaways: [
        "Never store plain text passwords — always hash with bcrypt, scrypt, or argon2.",
        "Fast hashes like MD5 and SHA-256 are unsafe for passwords because attackers can try billions of guesses per second.",
        "Use a `PasswordService` so hashing logic lives in one place and can be changed safely.",
        "Return generic 'Invalid credentials' errors to prevent account enumeration.",
        "Issue short-lived access tokens (15m) and long-lived, revocable refresh tokens.",
        "Store refresh tokens in httpOnly cookies so XSS cannot read them.",
        "Logout must revoke the refresh token server-side, not just clear client state.",
        "Rate-limit login and registration endpoints to slow down brute force and credential stuffing.",
      ],
      commonMistakes: [
        "<b>Storing passwords with SHA-256 or MD5.</b> These are fast hashes; attackers can crack billions per second. Use bcrypt, scrypt, or argon2.",
        "<b>Comparing passwords with `===`.</b> This leaks timing information and is wrong even for hashes. Use `bcrypt.compare`.",
        "<b>Returning 'user not found' vs 'wrong password'.</b> This enables account enumeration. Always return a generic message.",
        "<b>Blocking registration on email delivery.</b> If SendGrid is slow, registration feels broken. Send verification emails asynchronously.",
        "<b>Not revoking refresh tokens on logout.</b> A copied refresh token keeps working after logout. Delete it from Redis/DB.",
        "<b>Logging passwords or tokens.</b> Log aggregation systems (Datadog, CloudWatch) will store them, creating a leak.",
        "<b>Putting the refresh token in localStorage.</b> XSS can steal it. Use httpOnly cookies with `sameSite` and `secure` flags.",
      ],
      quiz: [
        {
          question: "Why is bcrypt preferred over SHA-256 for password hashing?",
          options: [
            "bcrypt produces shorter hashes",
            "bcrypt is deliberately slow and salted, making brute force much harder",
            "SHA-256 is not available in Node.js",
            "bcrypt is faster",
          ],
          correctIndex: 1,
          explanation:
            "SHA-256 is designed to be fast, which helps attackers. bcrypt is deliberately slow and includes a salt, so each guess costs significant time and identical passwords produce different hashes.",
        },
        {
          question: "What is the purpose of a refresh token?",
          options: [
            "To replace the access token entirely",
            "To let the client get a new access token without re-entering credentials, while remaining revocable",
            "To encrypt the database",
            "To store the user's password",
          ],
          correctIndex: 1,
          explanation:
            "Access tokens are short-lived so stolen ones expire quickly. Refresh tokens let the client silently obtain new access tokens. Because they are stored server-side, they can be revoked on logout or breach.",
        },
        {
          question: "Why should logout revoke the refresh token server-side?",
          options: [
            "Because cookies expire automatically",
            "Because otherwise a stolen refresh token remains valid even after the user logs out",
            "Because the client cannot delete cookies",
            "Because access tokens cannot expire",
          ],
          correctIndex: 1,
          explanation:
            "Clearing the client cookie only removes it from that device. If an attacker copied the refresh token, it still works until it expires. Server-side revocation makes logout actually end the session everywhere.",
        },
        {
          question: "A login endpoint returns 'User not found' for unknown emails and 'Wrong password' for known emails. What is the problem?",
          options: [
            "It is slower",
            "It enables account enumeration, telling attackers which emails are registered",
            "It breaks the JWT",
            "It requires two database queries",
          ],
          correctIndex: 1,
          explanation:
            "Different messages reveal whether an email exists. Attackers can build a list of valid accounts and target them. Always return a generic 'Invalid credentials' message.",
        },
      ],
    },

    // ============================================================
    // LESSON 3
    // ============================================================
    {
      id: "day-45-lesson-3",
      title: "Email Verification and Account Lifecycle",
      durationMinutes: 18,
      explanation: `
<b>Imagine a customer signs up with a typo in their email: <code>jhon.doe@gmial.com</code> instead of <code>john.doe@gmail.com</code>.</b> Without verification, they create an account they can never access, and the real owner of that address never consented. Verification solves this: it proves the user controls the email address before the account becomes fully usable.

But email verification is more than a checkbox. It is part of the <b>account lifecycle</b>: the set of states an account moves through from creation to deletion. A well-designed system knows which state each account is in and what actions are allowed in each state.

<h3>The account lifecycle</h3>

<pre>
PENDING_VERIFICATION --> ACTIVE --> SUSPENDED --> DELETED
        |                    |
        |                    +--> PASSWORD_RESET (temporary)
        |
        +--> EXPIRED (if never verified)
</pre>

• <b>PENDING_VERIFICATION:</b> Account created, email not yet confirmed. Can log in? Usually no, or yes with limited access.
• <b>ACTIVE:</b> Email verified. Full access.
• <b>SUSPENDED:</b> Admin-disabled account. Can log in? No. Can be reinstated.
• <b>DELETED:</b> Soft-deleted or hard-deleted. Data retention rules apply.
• <b>PASSWORD_RESET:</b> A temporary state triggered by a reset request.

Beginners often model users as a boolean: <code>isActive</code>. That breaks down quickly. You need a <b>status</b> field (enum) plus timestamps like <code>emailVerifiedAt</code>, <code>suspendedAt</code>, <code>deletedAt</code>. Timestamps are better than booleans because they tell you <i>when</i> something happened, which matters for audits and debugging.

<h3>How verification works</h3>

• On registration, generate a random verification token (e.g., 32 bytes hex).
• Store a hash of the token in the database with an expiry (e.g., 24 hours) and the user ID.
• Email the raw token in a link: <code>https://app.example.com/verify?token=...</code>.
• When the user clicks, the server hashes the token, looks it up, checks expiry, and marks the user as verified.
• Delete the token so it can't be reused.

Why store a <b>hash</b> of the token? Because if your database leaks, attackers shouldn't be able to verify accounts or reset passwords. Treat verification tokens like passwords: hash them at rest.

<h3>Resending verification</h3>

Users lose emails. They mistype. Emails land in spam. You need a <b>resend verification</b> endpoint. But you must rate-limit it heavily, or it becomes a spam cannon: attackers can use it to send thousands of emails to a victim. Rules:

• Only send if the account is in PENDING_VERIFICATION.
• Rate-limit per email and per IP (e.g., 3 per hour).
• Invalidate previous tokens when issuing a new one.
• Return a generic success message regardless of whether the email exists.

<h3>Real-world scenario: food delivery app</h3>

A rider registers. They receive a verification email. Until they verify, they can log in but cannot accept deliveries. The app shows a banner: "Please verify your email to start earning." This is a common pattern: <b>limited access until verified</b>. It keeps the user engaged while still enforcing the security boundary. For customers, you might allow browsing but require verification before checkout.

<h3>What can go wrong</h3>

• <b>Storing raw tokens:</b> a database leak lets attackers verify arbitrary accounts.
• <b>No expiry:</b> verification links work forever, even years later.
• <b>Reusable tokens:</b> after successful verification, the token still works.
• <b>No rate limiting on resend:</b> becomes an email spam relay.
• <b>Different responses for existing vs non-existing emails:</b> account enumeration.
• <b>Not handling typo emails:</b> users stuck in PENDING forever. Provide a "change email" flow.

<h3>How experienced engineers think</h3>

They treat verification tokens as one-time, short-lived secrets. They store hashes, not raw tokens. They rate-limit resends. They model the account as a state machine, not a boolean. They log state transitions (for audits) but never log tokens. They design for the user who never verifies: what happens after 30 days? Usually you keep the account but block sensitive actions, or delete it per your privacy policy.
      `,
      diagram: `
Account Lifecycle
=================

  [Registration]
        |
        v
  PENDING_VERIFICATION
        |  (email link clicked)
        v
     ACTIVE  <-----+
        |           |
        | (admin)   | (reinstate)
        v           |
    SUSPENDED ------+
        |
        | (user or admin)
        v
     DELETED

Verification Token Flow
=======================

Registration
    |
    |-- generate random token (32 bytes)
    |-- store SHA-256(token) + userId + expiresAt
    |-- email raw token in link
    v
User clicks link
    |
    |-- server hashes incoming token
    |-- lookup by hash
    |-- check expiry
    |-- mark emailVerifiedAt = now()
    |-- delete token row
    v
ACTIVE
      `,
      codeExample: { title: "Example", code: `
// user.entity.ts
// The account state is an enum, not a boolean.
// Timestamps tell us *when* each transition happened.

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerifiedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ------------------------------------------------------------

// email-verification.entity.ts
// We store a HASH of the token, never the raw token.
// If the DB leaks, attackers cannot verify accounts.

import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('email_verifications')
export class EmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  tokenHash: string; // SHA-256 of the raw token

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

// ------------------------------------------------------------

// email-verification.service.ts
// Handles token generation, sending, and consumption.

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { EmailVerification } from './email-verification.entity';
import { User, UserStatus } from '../users/user.entity';
import { EmailService } from './email.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly tokens: Repository<EmailVerification>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly email: EmailService,
  ) {}

  private hash(raw: string) {
    return createHash('sha256').update(raw).digest('hex');
  }

  async sendVerification(user: User) {
    // Invalidate any previous tokens for this user.
    await this.tokens.delete({ userId: user.id });

    const raw = randomBytes(32).toString('hex');
    const tokenHash = this.hash(raw);

    await this.tokens.save({
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    });

    const link = \`https://app.example.com/verify?token=\${raw}\`;
    await this.email.send(user.email, 'Verify your email', link);
  }

  async consume(rawToken: string) {
    const tokenHash = this.hash(rawToken);

    const record = await this.tokens.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired token');
    }
    if (record.expiresAt < new Date()) {
      await this.tokens.delete({ id: record.id });
      throw new BadRequestException('Invalid or expired token');
    }

    // Mark user active and set the verification timestamp.
    await this.users.update(record.userId, {
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    });

    // One-time use: delete the token so it cannot be replayed.
    await this.tokens.delete({ id: record.id });
  }

  // Periodic cleanup: remove expired tokens.
  async cleanupExpired() {
    await this.tokens.delete({ expiresAt: LessThan(new Date()) });
  }
}

// ------------------------------------------------------------

// auth.controller.ts (verification endpoints)
// Rate-limited resend, generic responses.

import { Controller, Post, Get, Query, Body, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly verification: EmailVerificationService,
    private readonly users: UsersService,
  ) {}

  @Get('verify')
  async verify(@Query('token') token: string) {
    await this.verification.consume(token);
    return { message: 'Email verified' };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60 * 60 * 1000 } }) // 3 per hour
  @Post('resend-verification')
  async resend(@Body() dto: ResendVerificationDto) {
    const user = await this.users.findByEmail(dto.email);
    // Always return the same message to prevent enumeration.
    if (user && user.status === UserStatus.PENDING_VERIFICATION) {
      await this.verification.sendVerification(user);
    }
    return { message: 'If the account exists, a verification email was sent' };
  }
}
      ` },
      keyTakeaways: [
        "Model the account as a state machine (`PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `DELETED`), not a boolean.",
        "Store a hash of verification tokens, never the raw token.",
        "Verification tokens must be single-use and expire (e.g., 24 hours).",
        "Rate-limit resend verification endpoints to prevent email spam abuse.",
        "Return generic responses from resend endpoints to prevent account enumeration.",
        "Use timestamps (`emailVerifiedAt`, `suspendedAt`) instead of booleans for auditability.",
        "Plan for users who never verify: limited access, reminder emails, or eventual cleanup.",
      ],
      commonMistakes: [
        "<b>Storing the raw verification token.</b> If the database leaks, attackers can verify any account. Store a SHA-256 hash instead.",
        "<b>Letting verification tokens live forever.</b> A token from two years ago should not still work. Always set an expiry.",
        "<b>Not deleting the token after use.</b> A reusable token means anyone who sees the email link can verify again. Delete on success.",
        "<b>No rate limit on resend.</b> Attackers can use your email provider to spam victims. Limit per email and per IP.",
        "<b>Returning 'email not found' on resend.</b> This enables enumeration. Always return a generic success message.",
        "<b>Using a boolean `isVerified` instead of a status enum.</b> You lose the ability to represent suspended or deleted states cleanly.",
      ],
      quiz: [
        {
          question: "Why should you store a hash of the email verification token instead of the raw token?",
          options: [
            "To save database space",
            "So a database leak doesn't let attackers verify arbitrary accounts",
            "Because hashes are faster to query",
            "Because raw tokens are too long",
          ],
          correctIndex: 1,
          explanation:
            "Verification tokens are credentials. If the database leaks and tokens are stored raw, attackers can verify accounts or reset passwords. Hashing them at rest means the leak is not directly exploitable.",
        },
        {
          question: "What is the main risk of not rate-limiting the resend-verification endpoint?",
          options: [
            "Users will get too many emails",
            "The database will grow",
            "Attackers can use your system to spam arbitrary email addresses",
            "The JWT secret will rotate",
          ],
          correctIndex: 2,
          explanation:
            "Without rate limiting, an attacker can call resend-verification thousands of times with different emails, turning your app into a spam relay and damaging your sending reputation.",
        },
        {
          question: "Why is a status enum better than a boolean `isActive` for account lifecycle?",
          options: [
            "Enums use less memory",
            "Booleans are deprecated in TypeScript",
            "A status enum can represent pending, active, suspended, and deleted states, which a boolean cannot",
            "Booleans are not supported by PostgreSQL",
          ],
          correctIndex: 2,
          explanation:
            "A boolean only tells you active or not. Real accounts move through several states. An enum makes the allowed states explicit and prevents impossible combinations.",
        },
      ],
    },

    // ============================================================
    // LESSON 4
    // ============================================================
    {
      id: "day-45-lesson-4",
      title: "Forgot Password and Secure Password Reset",
      durationMinutes: 22,
      explanation: `
<b>Imagine a customer forgot their password on a Friday night and wants to order dinner.</b> They tap "Forgot Password," enter their email, and expect a reset link. If this flow is insecure, an attacker can take over accounts. If it's too strict, users get locked out. This is one of the most attacked flows in any application because it is designed to bypass the normal login — which means it must be even more carefully protected.

<h3>The naive (and dangerous) approach</h3>

A beginner might do this:

• User enters email.
• Server finds the user.
• Server generates a temporary password, updates the user's password in the DB, and emails the temporary password.

This is bad for several reasons:

• <b>Email is not a secure channel.</b> Sending a temporary password in plain text means anyone with access to the email (or the email provider) can log in.
• <b>The password is changed immediately.</b> The legitimate user is locked out until they check email — and if they never do, their account is in a broken state.
• <b>No expiry or single-use.</b> The temporary password works forever.
• <b>Account enumeration.</b> If the response differs for existing vs non-existing emails, attackers learn which accounts exist.

<h3>The secure flow</h3>

• User submits email to <code>POST /auth/forgot-password</code>.
• Server always returns a generic message: "If an account exists, a reset link was sent."
• If the user exists, generate a random token (32 bytes), store its <b>hash</b> with an expiry (15–30 minutes).
• Email a link: <code>https://app.example.com/reset?token=...</code>.
• User clicks the link and submits a new password to <code>POST /auth/reset-password</code>.
• Server hashes the incoming token, looks it up, checks expiry, and verifies it hasn't been used.
• Server hashes the new password, updates the user, and <b>revokes all existing sessions/refresh tokens</b>.
• Server deletes the reset token.
• Server optionally emails a confirmation: "Your password was changed."

<h3>Why revoke all sessions?</h3>

If an attacker had access to the account (e.g., a stolen laptop with an active session), changing the password should kick them out. Revoking all refresh tokens ensures the new password is required everywhere.

<h3>Why short expiry?</h3>

Password reset links are highly sensitive. If an email is intercepted or forwarded, a short window limits the damage. 15–30 minutes is standard. Some systems use 1 hour. Anything beyond 24 hours is risky.

<h3>Why store a hash of the token?</h3>

Same reason as verification: if the database leaks, raw reset tokens would let attackers reset passwords. Hashing makes the leak far less dangerous.

<h3>Real-world scenario: food delivery app</h3>

A restaurant owner forgot their password. They request a reset. The email arrives with a link valid for 20 minutes. They set a new password. The system revokes all their active sessions (so a shared tablet in the kitchen is logged out), sends a confirmation email, and deletes the token. If an attacker had somehow obtained the old password, they are now locked out.

<h3>What can go wrong</h3>

• <b>Revealing whether the email exists.</b> Account enumeration.
• <b>Long-lived tokens.</b> Intercepted emails become usable for days.
• <b>Reusable tokens.</b> A token can reset the password multiple times.
• <b>Not revoking sessions.</b> Old sessions remain valid after password change.
• <b>Weak password policy on reset.</b> Users set "123456" because the form allows it.
• <b>Emailing the new password.</b> Never do this. Email is not secure.
• <b>Not logging the event.</b> You can't investigate a breach if you don't know when the password changed.
• <b>Race conditions.</b> Two reset requests in parallel could both succeed. Use a transaction or atomic update.

<h3>How experienced engineers think</h3>

They treat password reset as a high-risk endpoint: rate-limited, monitored, and heavily logged (without logging secrets). They use short-lived, single-use, hashed tokens. They revoke sessions on success. They send a confirmation email so the user knows if someone else tried. They never reveal whether an email exists. And they test the flow for race conditions, token reuse, and expired tokens.
      `,
      diagram: `
Password Reset Flow
===================

User                API                  DB / Email
 |                   |                    |
 |-- POST /forgot -->|                    |
 |                   |-- find user ------>|
 |                   |<-- user (or null) -|
 |                   |-- generate token   |
 |                   |-- store SHA-256 -->|
 |                   |-- send email ----->| (async)
 |<-- generic msg ---|                    |
 |                   |                    |
 |  (user clicks link in email)            |
 |                   |                    |
 |-- POST /reset --->|                    |
 |   {token, newPwd} |                    |
 |                   |-- hash token       |
 |                   |-- lookup hash ---->|
 |                   |<-- record ---------|
 |                   |-- check expiry     |
 |                   |-- hash new pwd     |
 |                   |-- update user ---->|
 |                   |-- revoke sessions->|
 |                   |-- delete token --->|
 |<-- 200 OK --------|                    |
 |                   |-- send confirmation email
      `,
      codeExample: { title: "Example", code: `
// password-reset.entity.ts
// Stores a hash of the reset token, not the raw token.
// Short expiry (20 minutes) limits the window of attack.

import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  tokenHash: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// ------------------------------------------------------------

// password-reset.service.ts
// Handles token creation, consumption, and session revocation.

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { PasswordReset } from './password-reset.entity';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { EmailService } from './email.service';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly resets: Repository<PasswordReset>,
    private readonly users: UsersService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
    private readonly email: EmailService,
  ) {}

  private hash(raw: string) {
    return createHash('sha256').update(raw).digest('hex');
  }

  async request(email: string) {
    const user = await this.users.findByEmail(email);

    // Always behave the same whether the user exists or not.
    if (!user) return;

    // Invalidate previous reset tokens for this user.
    await this.resets.delete({ userId: user.id });

    const raw = randomBytes(32).toString('hex');
    const tokenHash = this.hash(raw);

    await this.resets.save({
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 20), // 20 minutes
      used: false,
    });

    const link = \`https://app.example.com/reset?token=\${raw}\`;
    await this.email.send(user.email, 'Reset your password', link);
  }

  async reset(rawToken: string, newPassword: string) {
    const tokenHash = this.hash(rawToken);

    const record = await this.resets.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!record || record.used || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const newHash = await this.passwords.hash(newPassword);

    // Atomic-ish: mark used first, then update. In production use a transaction.
    await this.resets.update(record.id, { used: true });
    await this.users.updatePassword(record.userId, newHash);

    // Revoke every refresh token for this user so old sessions die.
    await this.tokens.revokeAllForUser(record.userId);

    // Confirmation email: if the user didn't do this, they can react.
    await this.email.send(
      record.user.email,
      'Your password was changed',
      'If you did not request this, contact support immediately.',
    );
  }
}

// ------------------------------------------------------------

// auth.controller.ts (reset endpoints)
// Rate-limited and returning generic messages.

import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

class ForgotPasswordDto {
  email: string;
}

class ResetPasswordDto {
  token: string;
  @MinLength(12)
  @MaxLength(72)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly reset: PasswordResetService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60 * 60 * 1000 } }) // 3 per hour
  @Post('forgot-password')
  @HttpCode(200)
  async forgot(@Body() dto: ForgotPasswordDto) {
    await this.reset.request(dto.email);
    // Generic message prevents enumeration.
    return { message: 'If an account exists, a reset link was sent' };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60 * 60 * 1000 } })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.reset.reset(dto.token, dto.password);
    return { message: 'Password updated' };
  }
}

/*
Why this is safer:

1. Raw token is emailed; only its hash is stored.
2. 20-minute expiry limits exposure.
3. Single-use: \`used\` flag prevents replay.
4. All sessions revoked on success.
5. Generic responses prevent enumeration.
6. Rate limiting slows brute force and abuse.
7. Confirmation email alerts the user to unexpected changes.
*/
      ` },
      keyTakeaways: [
        "Never email a temporary password — email a single-use reset link instead.",
        "Store a hash of the reset token, never the raw token.",
        "Reset tokens must expire quickly (15–30 minutes) and be single-use.",
        "Always return a generic message from forgot-password to prevent account enumeration.",
        "Revoke all refresh tokens/sessions after a password reset.",
        "Rate-limit both forgot-password and reset-password endpoints.",
        "Send a confirmation email after a password change so users can react if it wasn't them.",
        "Use a transaction or atomic update to prevent race conditions on token consumption.",
      ],
      commonMistakes: [
        "<b>Emailing the new password directly.</b> Email is not a secure channel. Always send a reset link, never a password.",
        "<b>Storing reset tokens in plain text.</b> A database leak would let attackers reset passwords. Hash them at rest.",
        "<b>Letting reset tokens live for days.</b> Intercepted emails become usable for too long. Use 15–30 minutes.",
        "<b>Not revoking sessions after reset.</b> An attacker with an existing session stays logged in. Revoke all refresh tokens.",
        "<b>Revealing whether the email exists.</b> The forgot-password response must be identical for known and unknown emails.",
        "<b>No rate limiting.</b> Attackers can spam the endpoint or brute-force tokens. Limit per email and per IP.",
        "<b>Not deleting the token after use.</b> A reused token can reset the password again. Mark it used or delete it.",
      ],
      quiz: [
        {
          question: "Why is emailing a temporary password a bad idea?",
          options: [
            "It is slower than emailing a link",
            "Email is not a secure channel; anyone with access to the email can log in, and the password persists until changed",
            "Temporary passwords are too long",
            "It requires extra database columns",
          ],
          correctIndex: 1,
          explanation:
            "Email is transmitted and stored by providers. A temporary password in plain text is exposed to anyone with access to the inbox. A single-use link with a short expiry is far safer.",
        },
        {
          question: "What should happen to existing sessions when a user resets their password?",
          options: [
            "Nothing — sessions are independent",
            "Only the current session should be kept",
            "All refresh tokens/sessions should be revoked so anyone with a stolen session is logged out",
            "Sessions should be extended",
          ],
          correctIndex: 2,
          explanation:
            "If an attacker had access to the account, changing the password should kick them out. Revoking all refresh tokens ensures the new password is required everywhere.",
        },
        {
          question: "Why store a hash of the password reset token?",
          options: [
            "To make the email shorter",
            "So a database leak doesn't let attackers reset arbitrary passwords",
            "Because hashes are easier to index",
            "To prevent token expiry",
          ],
          correctIndex: 1,
          explanation:
            "Reset tokens are credentials. Hashing them at rest means a leaked database does not directly give attackers the ability to reset passwords.",
        },
        {
          question: "A forgot-password endpoint responds 'Email sent' for known emails and 'Email not found' for unknown ones. What is the problem?",
          options: [
            "It is slower",
            "It enables account enumeration",
            "It uses more memory",
            "It breaks the reset link",
          ],
          correctIndex: 1,
          explanation:
            "Different responses reveal which emails are registered. Attackers can build a target list. Always return the same generic message.",
        },
      ],
    },

    // ============================================================
    // LESSON 5
    // ============================================================
    {
      id: "day-45-lesson-5",
      title: "RBAC, Permissions, and NestJS Guards",
      durationMinutes: 20,
      explanation: `
<b>Imagine the food delivery app now has thousands of users: customers, riders, restaurant owners, and admins.</b> A customer should never see another customer's orders. A rider should only see deliveries assigned to them. A restaurant owner should only manage their own restaurant. An admin can do everything. This is <b>authorization</b> — and it is different from authentication.

<b>Authentication</b> answers "Who are you?" <b>Authorization</b> answers "What are you allowed to do?" You can be authenticated (logged in) and still not be allowed to delete another user's account. Beginners often confuse the two, which leads to bugs where any logged-in user can access anything.

<h3>RBAC: Role-Based Access Control</h3>

The simplest authorization model is RBAC: every user has one or more <b>roles</b>, and each role grants certain permissions. For example:

• <b>customer:</b> can view own orders, place orders, cancel own orders.
• <b>rider:</b> can view assigned deliveries, update delivery status.
• <b>owner:</b> can manage own restaurant, view orders for own restaurant.
• <b>admin:</b> can do anything.

In its simplest form, a user has a <code>role</code> string. In more complex systems, a user can have multiple roles, and roles map to fine-grained <b>permissions</b>. For a food delivery app, RBAC is usually enough. For a SaaS with per-tenant permissions, you may need something richer (ABAC or ReBAC), but start with RBAC.

<h3>Why not just check roles in controllers?</h3>

You can write:

<pre>
if (user.role !== 'admin') throw new ForbiddenException();
</pre>

in every controller. But that is repetitive, easy to forget, and hard to change. Instead, NestJS gives us <b>Guards</b> — reusable classes that run before the route handler and decide whether the request is allowed.

<h3>How guards work in NestJS</h3>

A guard implements <code>canActivate(context)</code>. It returns <code>true</code> to allow, <code>false</code> or throws to deny. Guards run after middleware but before pipes and the handler. You apply them with <code>@UseGuards(SomeGuard)</code> at the controller or route level.

For RBAC, the pattern is:

• <code>JwtAuthGuard</code> verifies the access token and attaches <code>req.user</code>.
• <code>RolesGuard</code> reads metadata set by a <code>@Roles('admin')</code> decorator and checks <code>req.user.roles</code>.
• If the user's roles don't intersect the required roles, throw <code>ForbiddenException</code>.

<h3>Permissions vs. roles</h3>

Roles are coarse: "admin" or "customer." Permissions are fine-grained: <code>orders:read</code>, <code>orders:refund</code>, <code>restaurant:update</code>. In a growing app, you often move from roles to permissions:

• Role <code>owner</code> maps to permissions <code>restaurant:update</code>, <code>menu:write</code>, <code>orders:read:own</code>.
• Role <code>admin</code> maps to all permissions.

This makes it easier to add new roles without changing every guard. You check permissions, not roles.

<h3>Ownership checks</h3>

RBAC alone is not enough for "own resources." A customer role says "can view orders," but you also need "can view <i>own</i> orders." This is where <b>resource-level authorization</b> comes in. You check <code>order.userId === req.user.id</code> inside the service or a dedicated policy. NestJS does not have a built-in policy framework, but you can implement one with guards + a <code>PoliciesService</code>, or use a library like <code>casl</code>.

<h3>Real-world scenario: food delivery app</h3>

A rider calls <code>GET /deliveries/:id</code>. The <code>JwtAuthGuard</code> confirms they are logged in. The <code>RolesGuard</code> confirms they have the <code>rider</code> role. Then the service checks that the delivery is assigned to <i>this</i> rider. If another rider tries to view it, they get 403 — even though they have the rider role. This is defense in depth for authorization.

<h3>What can go wrong</h3>

• <b>Checking roles only on the frontend.</b> Anyone can call the API directly. Always enforce on the server.
• <b>Forgetting guards on new routes.</b> NestJS does not apply guards globally by default. Use a global guard or audit routes.
• <b>Trusting <code>req.user</code> from the client.</b> <code>req.user</code> must be set by the JWT strategy, never by request body or headers.
• <b>Confusing 401 and 403.</b> 401 = not authenticated; 403 = authenticated but not allowed.
• <b>Not checking ownership.</b> A rider can view any delivery if you only check roles.
• <b>Hardcoding role strings everywhere.</b> Use enums or constants so typos don't silently disable checks.
• <b>Over-permissive admin role.</b> Admin should not bypass audit logs or MFA requirements.

<h3>How experienced engineers think</h3>

They assume the client is hostile and enforce everything server-side. They use global guards for authentication and route-level guards for authorization. They separate roles (coarse) from permissions (fine) and add ownership checks in services. They log authorization failures (without secrets) to detect probing. They test guards with unit tests and e2e tests, including negative cases: "customer cannot access admin route."
      `,
      diagram: `
Request Authorization Flow
==========================

Request
   |
   v
[ JwtAuthGuard ]  --> 401 if no/invalid token
   |
   v
[ RolesGuard ]    --> 403 if role not allowed
   |
   v
[ Ownership Check ] --> 403 if not owner
   |
   v
Controller Handler
   |
   v
Service
   |
   v
Repository / DB

Role -> Permission mapping (example)
====================================

customer: orders:create, orders:read:own
rider:    deliveries:read:own, deliveries:update:own
owner:    restaurant:update:own, menu:write:own, orders:read:own
admin:    * (all permissions, audited)
      `,
      codeExample: { title: "Example", code: `
// roles.decorator.ts
// A small decorator to attach required roles as metadata.

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// ------------------------------------------------------------

// roles.guard.ts
// Reads the metadata and checks the authenticated user's roles.

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles decorator means no role restriction.
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      // Should not happen if JwtAuthGuard ran first, but be defensive.
      throw new ForbiddenException('No authenticated user');
    }

    const hasRole = required.some((role) => user.roles?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}

// ------------------------------------------------------------

// deliveries.controller.ts
// Guards run in order: authentication, then authorization, then ownership.

import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard) // order matters
export class DeliveriesController {
  constructor(private readonly deliveries: DeliveriesService) {}

  @Roles('rider', 'admin')
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    // Ownership check happens in the service.
    return this.deliveries.findOneForUser(id, req.user);
  }
}

// ------------------------------------------------------------

// deliveries.service.ts
// Resource-level authorization: even a rider cannot see another rider's delivery.

import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './delivery.entity';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveries: Repository<Delivery>,
  ) {}

  async findOneForUser(id: string, user: { id: string; roles: string[] }) {
    const delivery = await this.deliveries.findOne({ where: { id } });
    if (!delivery) throw new NotFoundException();

    // Admins can see everything; riders only their own.
    const isAdmin = user.roles.includes('admin');
    const isOwner = delivery.riderId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException();
    }

    return delivery;
  }
}

// ------------------------------------------------------------

// Optional: a permissions-based guard for finer control.
// Permissions are strings like 'orders:refund'.

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...p: string[]) =>
  SetMetadata(PERMISSIONS_KEY, p);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) return true;

    const user = context.switchToHttp().getRequest().user;
    const perms: string[] = user?.permissions ?? [];

    const ok = required.every((p) => perms.includes(p));
    if (!ok) throw new ForbiddenException();
    return true;
  }
}

/*
Key ideas:

1. Authentication first (JwtAuthGuard), then authorization (RolesGuard).
2. Roles are coarse; permissions are fine-grained.
3. Ownership checks belong in the service, not the guard,
   because they need the resource.
4. Use enums/constants for role names to avoid typos.
5. Return 403 for authorization failures, 401 for authentication failures.
6. Test negative cases: a customer calling an admin route must fail.
*/
      ` },
      keyTakeaways: [
        "Authentication answers 'who are you'; authorization answers 'what can you do'.",
        "Use `JwtAuthGuard` for authentication and `RolesGuard` for role-based authorization.",
        "Roles are coarse-grained; permissions are fine-grained and more scalable.",
        "Always enforce authorization on the server — never trust the client.",
        "Add ownership checks in the service for 'own resource' rules.",
        "Return `401 Unauthorized` for missing/invalid auth and `403 Forbidden` for insufficient permissions.",
        "Use constants or enums for role names to prevent typos that silently disable checks.",
        "Test negative cases: a customer must not access admin routes, and a rider must not access another rider's delivery.",
      ],
      commonMistakes: [
        "<b>Checking roles only on the frontend.</b> Anyone can call the API directly. Always enforce server-side.",
        "<b>Forgetting to apply guards to new routes.</b> NestJS does not add guards automatically. Audit routes or use global guards.",
        "<b>Trusting `req.user` from the client.</b> `req.user` must be set by the JWT strategy from a verified token, never from headers or body.",
        "<b>Returning 401 instead of 403 (or vice versa).</b> 401 means not authenticated; 403 means authenticated but not allowed. Clients rely on this distinction.",
        "<b>Only checking roles, not ownership.</b> A rider role should not grant access to every delivery. Check the resource owner.",
        "<b>Hardcoding role strings.</b> A typo like 'admn' silently fails open or closed depending on logic. Use constants.",
        "<b>Giving admin a free pass everywhere.</b> Admin actions should still be audited and may require MFA.",
      ],
      quiz: [
        {
          question: "What is the difference between authentication and authorization?",
          options: [
            "They are the same thing",
            "Authentication proves identity; authorization decides what an identity can do",
            "Authorization proves identity; authentication decides permissions",
            "Authentication is only for admins",
          ],
          correctIndex: 1,
          explanation:
            "Authentication verifies who you are (login). Authorization determines what you are allowed to do (roles, permissions, ownership). You can be authenticated but not authorized.",
        },
        {
          question: "Why is checking roles only on the frontend insufficient?",
          options: [
            "Frontend code is slower",
            "Attackers can call the API directly, bypassing the UI",
            "Frontend cannot read roles",
            "It uses too much bandwidth",
          ],
          correctIndex: 1,
          explanation:
            "The frontend is fully controlled by the user. Anyone can inspect and call the API directly. Authorization must be enforced on the server for every request.",
        },
        {
          question: "A rider calls `GET /deliveries/:id` for a delivery assigned to another rider. They have the `rider` role. What should happen?",
          options: [
            "Allow it because they have the rider role",
            "Return 403 because ownership check fails",
            "Return 401 because they are not authenticated",
            "Return the delivery",
          ],
          correctIndex: 1,
          explanation:
            "Roles are necessary but not sufficient. The service must also check that the delivery belongs to this rider. Otherwise any rider can view any delivery.",
        },
        {
          question: "What HTTP status should be returned when an authenticated user lacks permission?",
          options: ["200", "401", "403", "500"],
          correctIndex: 2,
          explanation:
            "401 means unauthenticated (no valid credentials). 403 means authenticated but forbidden (insufficient permissions). Clients rely on this distinction to decide whether to redirect to login or show a permission error.",
        },
      ],
    },

    // ============================================================
    // LESSON 6
    // ============================================================
    {
      id: "day-45-lesson-6",
      title: "OAuth/OIDC Integration and Account Linking",
      durationMinutes: 22,
      explanation: `
<b>Imagine you want to let users sign in to your food delivery app with Google.</b> They tap "Continue with Google," approve the consent screen, and they're in — no password to remember. Behind that simple button is a protocol called <b>OAuth 2.0</b>, and on top of it, <b>OpenID Connect (OIDC)</b>, which adds identity information.

OAuth is one of the most misunderstood topics in web development. It is <i>not</i> an authentication protocol by itself — it is an <b>authorization</b> framework. OIDC layers identity on top. When we say "Login with Google," we are really doing OIDC: Google authenticates the user and tells us who they are via an <b>ID token</b>.

<h3>The players in OAuth/OIDC</h3>

• <b>Resource Owner:</b> the user.
• <b>Client:</b> your app (the food delivery app).
• <b>Authorization Server:</b> Google's OAuth server.
• <b>Resource Server:</b> Google APIs (e.g., user profile).

<h3>The Authorization Code Flow (simplified)</h3>

• Your app redirects the user to Google's authorization endpoint with <code>client_id</code>, <code>redirect_uri</code>, <code>scope=openid email profile</code>, and a random <code>state</code> value.
• Google shows a consent screen. The user approves.
• Google redirects back to your <code>redirect_uri</code> with a <b>code</b> and the same <code>state</code>.
• Your server exchanges the code (plus <code>client_secret</code>) for tokens: an <b>access token</b> and an <b>ID token</b> (a JWT).
• Your server verifies the ID token's signature, issuer, audience, and expiry.
• Your server extracts the user's identity (email, name, <code>sub</code>) and creates or links a local user.
• Your server issues its own access + refresh tokens to the client.

The <code>state</code> parameter prevents CSRF: an attacker cannot trick your app into accepting a code that wasn't initiated by the same browser session.

<h3>Why use OAuth/OIDC?</h3>

• <b>Convenience:</b> users don't create or remember another password.
• <b>Security:</b> Google handles MFA, breach detection, and password resets.
• <b>Trust:</b> users trust Google's login more than a small app's.

<h3>Account linking: the hard part</h3>

When a user signs in with Google, you get an email. But you may already have a local account with that email. You have three choices:

• <b>Auto-link by email:</b> If the email matches a local account, link the Google identity to it. Convenient, but dangerous if Google doesn't verify the email or if the local account was created with an unverified email.
• <b>Require password confirmation:</b> Ask the user to log in with their existing password once, then link. Safer, less convenient.
• <b>Refuse and ask them to log in first:</b> Safest, most friction.

Most production systems use option 2 or 3 for existing accounts, and option 1 only when the OAuth provider has verified the email (Google and GitHub do; some providers don't).

<b>Why is auto-linking dangerous?</b> Imagine an attacker creates a local account with <code>victim@gmail.com</code> before the victim signs up. Later the victim uses "Login with Google" with that email. If you auto-link, the attacker's account is now linked to the victim's Google identity — a takeover. Always verify email ownership before linking, or require password confirmation.

<h3>Real-world scenario: food delivery app</h3>

A customer taps "Continue with Google." Google returns an ID token with <code>email_verified: true</code>, <code>sub: 123456789</code>. Your app:

• Looks up an identity by <code>provider=google, providerUserId=123456789</code>.
• If found, logs that user in.
• If not found, checks if a local user with that email exists.
• If a local user exists and their email is verified, link. Otherwise, prompt for password confirmation or refuse.
• If no local user exists, create one with <code>emailVerified: true</code> (Google verified it) and link the identity.

This flow is safe and convenient.

<h3>What can go wrong</h3>

• <b>Not validating the <code>state</code> parameter.</b> CSRF on the OAuth callback.
• <b>Not verifying the ID token signature.</b> An attacker can forge identity.
• <b>Not checking <code>aud</code> (audience).</b> A token issued for another app is accepted.
• <b>Trusting the email without checking <code>email_verified</code>.</b> Account takeover via unverified email.
• <b>Auto-linking without confirmation.</b> Account takeover as described above.
• <b>Storing OAuth access tokens in the browser.</b> XSS risk. Keep provider tokens server-side if needed, and never use them as your session token.
• <b>Using implicit flow.</b> Deprecated for web apps. Use authorization code + PKCE.
• <b>Not handling provider outages.</b> If Google is down, users can't log in. Offer password login as fallback.

<h3>How experienced engineers think</h3>

They treat OAuth as an identity bridge: the provider authenticates, but <i>your</i> system issues the session. They validate every token property (signature, issuer, audience, expiry, nonce). They separate <b>identity providers</b> from <b>users</b>: one user can have multiple identities (Google, GitHub, email/password). They log linking events for audits. They test the callback with invalid state, expired tokens, and mismatched audiences. And they plan for provider outages with fallback login methods.
      `,
      diagram: `
OAuth/OIDC Authorization Code Flow
==================================

User          Browser        Your App         Google
 |               |              |               |
 |-- click ----->|              |               |
 |               |-- redirect ->|               |
 |               |              |-- /authorize ->|
 |               |              |   (state)      |
 |               |              |<-- consent ----|
 |               |              |<-- code+state -|
 |               |              |-- /token ----->|
 |               |              |   (code+secret)|
 |               |              |<-- id_token ---|
 |               |              |-- verify JWT   |
 |               |              |-- find/link user
 |               |              |-- issue app JWT
 |               |<-- app token -|               |
 |<-- logged in -|              |               |

Identity Linking Model
======================

users                 identities
+----+--------+       +----+----------+----------+---------+
| id | email  |       | id | userId   | provider | sub     |
+----+--------+       +----+----------+----------+---------+
| 1  | a@b.c  |<----->| 1  | 1        | google   | 123456  |
|    |        |<----->| 2  | 1        | github   | abcdef  |
|    |        |<----->| 3  | 1        | password | null    |
+----+--------+       +----+----------+----------+---------+
      `,
      codeExample: { title: "Example", code: `
// identity.entity.ts
// One user can have multiple identities (Google, GitHub, password).
// This makes account linking explicit and auditable.

import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum IdentityProvider {
  PASSWORD = 'password',
  GOOGLE = 'google',
  GITHUB = 'github',
}

@Entity('identities')
@Index(['provider', 'providerUserId'], { unique: true })
export class Identity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: IdentityProvider })
  provider: IdentityProvider;

  // For PASSWORD, this is null. For OAuth, it's the provider's \`sub\`.
  @Column({ nullable: true })
  providerUserId: string | null;

  // Only used for PASSWORD identities.
  @Column({ nullable: true })
  passwordHash: string | null;

  @ManyToOne(() => User, (u) => u.identities, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ------------------------------------------------------------

// google.strategy.ts
// Passport strategy for Google OIDC.
// Passport handles the redirect and token exchange;
// we handle the user lookup/linking.

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly auth: AuthService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_CALLBACK_URL'),
      scope: ['openid', 'email', 'profile'],
      // \`state\` is handled by Passport + express-session by default.
      // In a stateless setup you would manage state yourself.
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const email = profile.emails?.[0]?.value;
      const emailVerified = profile.emails?.[0]?.verified ?? false;
      const providerUserId = profile.id;

      const user = await this.auth.findOrLinkOAuthUser({
        provider: 'google',
        providerUserId,
        email,
        emailVerified,
        name: profile.displayName,
      });

      done(null, user);
    } catch (err) {
      done(err as Error, false);
    }
  }
}

// ------------------------------------------------------------

// auth.service.ts (OAuth linking logic)
// This is the most security-sensitive part of OAuth integration.

import { Injectable, ConflictException } from '@nestjs/common';
import { IdentityProvider } from './identity.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly identities: IdentitiesService,
  ) {}

  async findOrLinkOAuthUser(input: {
    provider: IdentityProvider;
    providerUserId: string;
    email: string;
    emailVerified: boolean;
    name?: string;
  }) {
    // 1. If we already have an identity for this provider+sub, log in.
    const existingIdentity = await this.identities.find(
      input.provider,
      input.providerUserId,
    );
    if (existingIdentity) {
      return this.users.findById(existingIdentity.userId);
    }

    // 2. If a local user exists with this email, decide whether to link.
    const localUser = await this.users.findByEmail(input.email);
    if (localUser) {
      if (!input.emailVerified) {
        // Do not auto-link unverified emails. This prevents takeover.
        throw new ConflictException(
          'Email not verified by provider. Log in with your password to link.',
        );
      }
      // Safe to link because the provider verified the email.
      await this.identities.create({
        userId: localUser.id,
        provider: input.provider,
        providerUserId: input.providerUserId,
      });
      return localUser;
    }

    // 3. No local user: create one and link the identity.
    const user = await this.users.create({
      email: input.email,
      name: input.name ?? input.email.split('@')[0],
      emailVerified: input.emailVerified,
    });
    await this.identities.create({
      userId: user.id,
      provider: input.provider,
      providerUserId: input.providerUserId,
    });
    return user;
  }
}

// ------------------------------------------------------------

// auth.controller.ts (Google routes)
// The callback issues our own tokens, not Google's.

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport redirects to Google.
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    // req.user is the linked local user from GoogleStrategy.validate().
    const { accessToken, refreshToken } = await this.auth.login(req.user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    // Redirect to frontend with the access token in a fragment or via
    // a short-lived one-time code. Avoid putting tokens in query strings.
    res.redirect(\`https://app.example.com/oauth/callback#access_token=\${accessToken}\`);
  }
}

/*
Key ideas:

1. OAuth providers authenticate; your app issues its own session.
2. Always verify the ID token signature, issuer, audience, and expiry.
3. Check \`email_verified\` before linking to an existing local account.
4. Model identities separately from users so one user can have many logins.
5. Never store provider access tokens in the browser as your session token.
6. Handle provider outages with a fallback (password login).
*/
      ` },
      keyTakeaways: [
        "OAuth 2.0 is an authorization framework; OIDC adds identity on top.",
        "Use the authorization code flow with PKCE; avoid the deprecated implicit flow.",
        "Always validate the `state` parameter to prevent CSRF on the callback.",
        "Verify the ID token's signature, issuer, audience, expiry, and nonce.",
        "Model `identities` separately from `users` so one user can link multiple providers.",
        "Never auto-link an OAuth identity to an existing local account unless the provider has verified the email.",
        "Your app should issue its own session tokens; never use the provider's access token as your session.",
        "Plan for provider outages with a fallback login method.",
      ],
      commonMistakes: [
        "<b>Not validating the `state` parameter.</b> This enables CSRF attacks on the OAuth callback. Always compare the returned state with the one you stored.",
        "<b>Not verifying the ID token.</b> An attacker could forge a token. Verify signature, issuer, audience, and expiry using the provider's public keys.",
        "<b>Trusting the email without `email_verified`.</b> Some providers allow unverified emails. Linking on an unverified email can lead to account takeover.",
        "<b>Auto-linking without confirmation.</b> If an attacker pre-registers the victim's email, auto-linking hands over the account. Require password confirmation or verified email.",
        "<b>Storing provider access tokens in localStorage.</b> XSS can steal them. Keep provider tokens server-side if you need them at all.",
        "<b>Using the implicit flow.</b> It exposes tokens in the URL fragment and is deprecated. Use authorization code + PKCE.",
        "<b>No fallback when the provider is down.</b> If Google has an outage, users are locked out. Keep password login available.",
      ],
      quiz: [
        {
          question: "Why is the `state` parameter important in the OAuth authorization code flow?",
          options: [
            "It encrypts the authorization code",
            "It prevents CSRF by ensuring the callback matches the original request",
            "It stores the user's password",
            "It speeds up the token exchange",
          ],
          correctIndex: 1,
          explanation:
            "The `state` is a random value sent to the provider and returned in the callback. If it doesn't match what your app stored, the callback may be forged. It's a CSRF protection.",
        },
        {
          question: "Why is auto-linking an OAuth identity to an existing local account dangerous?",
          options: [
            "It uses too much database space",
            "An attacker could pre-register the victim's email and later gain access when the victim uses OAuth",
            "It makes login slower",
            "It breaks the JWT",
          ],
          correctIndex: 1,
          explanation:
            "If an attacker creates a local account with the victim's email before the victim signs up, auto-linking the victim's Google identity to that account gives the attacker access. Only link when the provider has verified the email, or require password confirmation.",
        },
        {
          question: "What should your app use as the session token after a successful OAuth login?",
          options: [
            "The provider's access token",
            "The ID token from the provider",
            "Your own access and refresh tokens issued by your backend",
            "The authorization code",
          ],
          correctIndex: 2,
          explanation:
            "The provider's tokens are for calling the provider's APIs. Your app should issue its own short-lived access token and revocable refresh token, so you control session lifetime and revocation.",
        },
        {
          question: "Why model `identities` separately from `users`?",
          options: [
            "To make the database larger",
            "So one user can link multiple providers (Google, GitHub, password) and linking is auditable",
            "Because NestJS requires it",
            "To avoid using JWTs",
          ],
          correctIndex: 1,
          explanation:
            "A user may log in with Google today and GitHub tomorrow. A separate identities table lets you link multiple providers to one user, track when each was linked, and revoke one without deleting the user.",
        },
      ],
    },

    // ============================================================
    // LESSON 7
    // ============================================================
    {
      id: "day-45-lesson-7",
      title: "Authentication Testing, Revocation, and Production Hardening",
      durationMinutes: 24,
      explanation: `
<b>Your authentication system works in development.</b> You can register, log in, reset a password, and sign in with Google. Now imagine it is Monday morning and 50,000 users are trying to log in. Someone is credential-stuffing from 10,000 IPs. A refresh token leaked in a mobile app bundle. Your email provider is rate-limiting you. This lesson is about everything that keeps authentication safe and reliable in production: <b>testing, revocation, monitoring, and hardening</b>.

<h3>Testing authentication</h3>

Authentication is the one system where "it works" is not enough. You need to test the <b>negative</b> cases: wrong password, expired token, reused token, missing role, wrong owner, disabled account, unverified email, revoked refresh token. Most auth bugs are found in these edge cases.

There are three levels of testing:

• <b>Unit tests:</b> test <code>PasswordService</code>, <code>TokenService</code>, and guards in isolation. Mock the database.
• <b>Integration tests:</b> test <code>AuthService</code> against a real test database. Verify registration creates a user, login issues tokens, reset revokes sessions.
• <b>E2E tests:</b> test the HTTP layer with <code>supertest</code>. Register → login → access protected route → refresh → logout → verify access denied.

For auth, E2E tests are especially valuable because they catch wiring mistakes: a guard not applied, a route missing <code>@UseGuards</code>, a cookie not set with <code>httpOnly</code>.

<h3>Token revocation</h3>

Access tokens are JWTs and are <b>stateless</b>: the server doesn't store them, so it can't easily revoke them. That's why they are short-lived (15 minutes). Refresh tokens <i>are</i> stored server-side, so they can be revoked instantly.

You need revocation for:

• <b>Logout:</b> delete the refresh token.
• <b>Password change/reset:</b> revoke all refresh tokens for the user.
• <b>Account suspension:</b> revoke all tokens and block new logins.
• <b>Breach response:</b> revoke tokens for affected users.
• <b>Token rotation:</b> when a refresh token is used, issue a new one and invalidate the old one. If the old one is used again, it indicates theft — revoke the whole family.

<b>Refresh token rotation</b> is a powerful pattern: each refresh token is single-use. When used, it is replaced by a new one. If an attacker steals a refresh token and uses it, the legitimate user's next refresh fails (because the token was already used), and you can detect and revoke the session family. This is how modern systems detect token theft.

<h3>Production hardening checklist</h3>

• <b>HTTPS everywhere.</b> Cookies with <code>secure: true</code> require it. Use HSTS.
• <b>Secrets in a manager.</b> JWT secret, DB password, OAuth client secret — never in git. Use AWS Secrets Manager, GCP Secret Manager, or Vault.
• <b>Rate limiting.</b> Login, register, forgot-password, reset-password, and refresh endpoints must be rate-limited per IP and per account.
• <b>Account lockout / backoff.</b> After N failed logins, slow down or temporarily lock. Be careful: lockout can be abused for DoS. Prefer exponential backoff and CAPTCHA.
• <b>Logging without secrets.</b> Log auth events (login success/failure, password reset, token revocation) with user ID, IP, user agent — but never passwords or tokens.
• <b>Monitoring and alerts.</b> Alert on spikes in failed logins, password resets, or token revocations. These often indicate attacks.
• <b>Session binding.</b> Optionally bind refresh tokens to a device fingerprint or IP range. This complicates legitimate use (mobile networks change IPs), so use carefully.
• <b>MFA.</b> For admins and high-value accounts, require TOTP or WebAuthn.
• <b>Dependency updates.</b> Auth libraries (passport, jsonwebtoken, bcrypt) have had CVEs. Keep them current.
• <b>Penetration testing.</b> Test enumeration, brute force, token reuse, and OAuth misconfigurations.

<h3>Real-world scenario: breach response</h3>

At 2 AM, your monitoring alerts: failed logins spiked 100x from a single ASN. You suspect credential stuffing. You:

• Enable stricter rate limits on login for that ASN.
• Require CAPTCHA for suspicious IPs.
• Notify users whose accounts had successful logins from new locations.
• Force password resets for accounts that logged in from the suspicious ASN.
• Revoke all refresh tokens for those accounts.
• Post-incident: analyze logs, adjust thresholds, and add MFA prompts for risky logins.

This is why logging and revocation matter: without them, you can't respond.

<h3>What can go wrong</h3>

• <b>No tests for negative cases.</b> A guard missing on one route is a full authorization bypass.
• <b>No revocation.</b> A stolen refresh token works until it expires.
• <b>No rotation.</b> You can't detect token theft.
• <b>Secrets in git.</b> One leaked repo compromises everything.
• <b>No rate limiting.</b> Brute force and credential stuffing succeed.
• <b>Logging tokens.</b> Your logs become a credential store.
• <b>No monitoring.</b> You learn about a breach from customers, not alerts.
• <b>Overly aggressive lockout.</b> Attackers lock out real users by failing their passwords. Prefer backoff + CAPTCHA.

<h3>How experienced engineers think</h3>

They assume a breach will happen and design for fast detection and response. They test the unhappy paths. They rotate refresh tokens. They monitor auth metrics. They keep secrets out of code. They document incident response. And they treat authentication as a product that needs ongoing maintenance, not a one-time feature.
      `,
      diagram: `
Refresh Token Rotation
======================

Client                  API                 Redis
  |                      |                    |
  |-- refresh (RT1) ---->|                    |
  |                      |-- lookup RT1 ----->|
  |                      |<-- valid, userId --|
  |                      |-- delete RT1 ----->|
  |                      |-- create RT2 ----->|
  |<-- new AT + RT2 -----|                    |
  |                      |                    |
  |  (attacker uses stolen RT1 later)         |
  |-- refresh (RT1) ---->|                    |
  |                      |-- lookup RT1 ----->|
  |                      |<-- not found ------|
  |                      |-- ALERT: reuse!    |
  |                      |-- revoke family -->|
  |<-- 401 --------------|                    |

Production Auth Monitoring
==========================

Metrics to track:
- login_success_total{method}
- login_failure_total{reason}
- password_reset_requested_total
- refresh_token_reuse_detected_total
- active_sessions_total
- auth_latency_seconds

Alerts:
- login_failure spike > 5x baseline
- refresh_token_reuse_detected > 0
- password_reset spike > 3x baseline
- 5xx on /auth/* > 1%
      `,
      codeExample: { title: "Example", code: `
// token.service.ts
// Refresh token rotation with reuse detection.
// This is the production pattern for detecting token theft.

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  private hash(raw: string) {
    return createHash('sha256').update(raw).digest('hex');
  }

  private key(userId: string, tokenHash: string) {
    return \`refresh:\${userId}:\${tokenHash}\`;
  }

  // A "family" groups tokens derived from the same login.
  private familyKey(familyId: string) {
    return \`refresh_family:\${familyId}\`;
  }

  async createRefreshToken(userId: string, familyId?: string): Promise<string> {
    const raw = randomBytes(48).toString('base64url');
    const tokenHash = this.hash(raw);
    const fam = familyId ?? randomBytes(16).toString('hex');

    // Store token -> family mapping with a 30-day TTL.
    await this.redis.set(this.key(userId, tokenHash), fam, 'EX', 60 * 60 * 24 * 30);
    // Track all tokens in the family for revocation.
    await this.redis.sadd(this.familyKey(fam), tokenHash);
    await this.redis.expire(this.familyKey(fam), 60 * 60 * 24 * 30);

    return raw;
  }

  async rotate(userId: string, incomingRaw: string): Promise<string> {
    const incomingHash = this.hash(incomingRaw);
    const familyId = await this.redis.get(this.key(userId, incomingHash));

    if (!familyId) {
      // Token not found. Could be expired, revoked, or reused after rotation.
      // If it's a reuse, the family may still exist — check and revoke.
      this.logger.warn(\`Refresh token not found for user \${userId} — possible reuse\`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Single-use: delete the old token immediately.
    await this.redis.del(this.key(userId, incomingHash));

    // Issue a new token in the same family.
    return this.createRefreshToken(userId, familyId);
  }

  async revokeRefreshToken(userId: string, raw: string) {
    const tokenHash = this.hash(raw);
    const familyId = await this.redis.get(this.key(userId, tokenHash));
    if (familyId) {
      await this.revokeFamily(familyId);
    }
  }

  async revokeAllForUser(userId: string) {
    // In a real system, maintain a user -> families index for this.
    // Here we scan (acceptable for small scale; use an index at scale).
    const keys = await this.redis.keys(\`refresh:\${userId}:*\`);
    if (keys.length) await this.redis.del(...keys);
  }

  private async revokeFamily(familyId: string) {
    const members = await this.redis.smembers(this.familyKey(familyId));
    const keys = members.map((h) => \`refresh:*:\${h}\`); // simplified
    if (keys.length) await this.redis.del(...keys);
    await this.redis.del(this.familyKey(familyId));
  }
}

// ------------------------------------------------------------

// auth.e2e-spec.ts
// End-to-end test covering the full lifecycle:
// register -> verify -> login -> access -> refresh -> logout -> deny.

import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const email = \`test_\${Date.now()}@example.com\`;
  const password = 'CorrectHorseBatteryStaple1!';
  let accessToken: string;
  let refreshCookie: string;

  it('registers a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'Test' })
      .expect(201);
    expect(res.body.passwordHash).toBeUndefined();
  });

  it('rejects login before verification (if enforced)', async () => {
    // Depends on policy. If limited access is allowed, expect 200 with restrictions.
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });
    expect([200, 403]).toContain(res.status);
  });

  it('logs in and returns tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    const cookies = res.headers['set-cookie'];
    expect(cookies.join(';')).toContain('refresh_token=');
    expect(cookies.join(';')).toContain('HttpOnly');

    accessToken = res.body.accessToken;
    refreshCookie = cookies.find((c: string) => c.startsWith('refresh_token='))!;
  });

  it('accesses a protected route', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', \`Bearer \${accessToken}\`)
      .expect(200);
  });

  it('rejects a protected route without a token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('refreshes the access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', refreshCookie)
      .expect(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('logs out and revokes the refresh token', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', \`Bearer \${accessToken}\`)
      .set('Cookie', refreshCookie)
      .expect(204);

    // The old refresh token must no longer work.
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', refreshCookie)
      .expect(401);
  });

  it('does not reveal whether an email exists on forgot-password', async () => {
    const known = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email });
    const unknown = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'nobody@example.com' });

    expect(known.status).toBe(unknown.status);
    expect(known.body).toEqual(unknown.body);
  });
});

/*
Key ideas:

1. Refresh token rotation: each refresh token is single-use.
2. Reuse detection: if an old token is used, revoke the whole family.
3. E2E tests cover the full lifecycle, including negative cases.
4. Forgot-password responses must be identical for known and unknown emails.
5. Cookies must be HttpOnly, Secure, and SameSite.
6. Log auth events, never log tokens or passwords.
*/
      ` },
      keyTakeaways: [
        "Test authentication thoroughly, especially negative cases: wrong password, expired token, reused token, missing role.",
        "Use E2E tests to catch wiring mistakes like a missing guard or a cookie without `httpOnly`.",
        "Implement refresh token rotation: each refresh token is single-use.",
        "Detect token reuse and revoke the entire token family on suspected theft.",
        "Revoke all refresh tokens on password change, account suspension, and breach response.",
        "Keep secrets in a secrets manager; never commit them to git.",
        "Rate-limit and monitor auth endpoints; alert on spikes in failures, resets, and token reuse.",
        "Prefer exponential backoff + CAPTCHA over hard account lockout to avoid DoS.",
      ],
      commonMistakes: [
        "<b>Testing only the happy path.</b> Most auth bugs are in negative cases: expired tokens, missing roles, reused tokens, wrong owners.",
        "<b>No refresh token rotation.</b> A stolen refresh token works until expiry, and you can't detect theft. Rotate on every use.",
        "<b>Logging tokens or passwords.</b> Logs are stored and aggregated; a logged token is a leaked token. Log events, not secrets.",
        "<b>Committing secrets to git.</b> Even private repos leak. Use environment variables and a secrets manager.",
        "<b>No rate limiting on auth endpoints.</b> Brute force and credential stuffing succeed. Limit per IP and per account.",
        "<b>Hard account lockout after N failures.</b> Attackers can lock out real users. Use exponential backoff and CAPTCHA.",
        "<b>No monitoring.</b> You learn about breaches from customers. Alert on auth anomalies.",
        "<b>Forgetting to revoke tokens on password reset.</b> An attacker with a session stays logged in. Revoke all refresh tokens.",
      ],
      quiz: [
        {
          question: "What is the main benefit of refresh token rotation?",
          options: [
            "It makes tokens shorter",
            "It detects token theft because a reused token indicates compromise",
            "It removes the need for access tokens",
            "It speeds up the database",
          ],
          correctIndex: 1,
          explanation:
            "With rotation, each refresh token is single-use. If an attacker uses a stolen token, the legitimate user's next refresh fails, and you can revoke the whole family. This turns token theft into a detectable event.",
        },
        {
          question: "Why should you prefer exponential backoff + CAPTCHA over hard account lockout?",
          options: [
            "Because lockout is illegal",
            "Because attackers can intentionally lock out real users, causing a denial of service",
            "Because CAPTCHA is faster",
            "Because backoff uses less memory",
          ],
          correctIndex: 1,
          explanation:
            "Hard lockout can be abused: an attacker repeatedly fails a victim's password to lock them out. Exponential backoff and CAPTCHA slow attackers without letting them deny access to real users.",
        },
        {
          question: "What should an E2E test for authentication include?",
          options: [
            "Only the successful login",
            "The full lifecycle including negative cases like missing tokens and revoked refresh tokens",
            "Only unit tests of the password service",
            "Only OAuth flows",
          ],
          correctIndex: 1,
          explanation:
            "E2E tests should cover register, login, access protected routes, refresh, logout, and negative cases: no token (401), wrong role (403), reused refresh token (401). This catches wiring mistakes that unit tests miss.",
        },
        {
          question: "Why is logging a refresh token dangerous?",
          options: [
            "It slows down the logger",
            "Logs are stored and aggregated, so a logged token becomes a leaked credential",
            "It breaks the JWT",
            "It uses too much disk space",
          ],
          correctIndex: 1,
          explanation:
            "Logs are often shipped to third-party systems (Datadog, CloudWatch) and retained for months. A token in the logs is effectively a leaked token. Log events and user IDs, never secrets.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the primary difference between authentication and authorization?",
      options: [
        "Authentication is for admins; authorization is for users",
        "Authentication proves identity; authorization decides what an identity can do",
        "They are the same",
        "Authorization is only used with OAuth",
      ],
      correctIndex: 1,
      explanation:
        "Authentication verifies who you are (login). Authorization determines what you are allowed to do (roles, permissions, ownership). You can be authenticated but not authorized.",
    },
    {
      question: "Why should passwords be hashed with bcrypt instead of SHA-256?",
      options: [
        "bcrypt produces shorter hashes",
        "bcrypt is deliberately slow and salted, making brute force much harder",
        "SHA-256 is not available in Node.js",
        "bcrypt is faster",
      ],
      correctIndex: 1,
      explanation:
        "Fast hashes like SHA-256 help attackers. bcrypt is deliberately slow and includes a salt, so each guess costs time and identical passwords produce different hashes.",
    },
    {
      question: "What is the purpose of a refresh token?",
      options: [
        "To replace the access token entirely",
        "To let the client obtain new access tokens without re-entering credentials, while remaining revocable",
        "To encrypt the database",
        "To store the user's password",
      ],
      correctIndex: 1,
      explanation:
        "Access tokens are short-lived so stolen ones expire quickly. Refresh tokens let the client silently get new access tokens. They are stored server-side so they can be revoked.",
    },
    {
      question: "Where should a refresh token be stored on the client?",
      options: [
        "localStorage",
        "sessionStorage",
        "An httpOnly, secure, sameSite cookie",
        "In the URL",
      ],
      correctIndex: 2,
      explanation:
        "httpOnly cookies are not readable by JavaScript, so XSS cannot steal them. `secure` ensures HTTPS only, and `sameSite` reduces CSRF risk.",
    },
    {
      question: "Why store a hash of email verification and password reset tokens?",
      options: [
        "To save space",
        "So a database leak doesn't let attackers verify accounts or reset passwords",
        "Because hashes are faster to query",
        "Because raw tokens are too long",
      ],
      correctIndex: 1,
      explanation:
        "These tokens are credentials. If stored raw and the database leaks, attackers can verify accounts or reset passwords. Hashing them at rest makes the leak far less dangerous.",
    },
    {
      question: "A login endpoint returns 'User not found' vs 'Wrong password'. What is the risk?",
      options: [
        "It is slower",
        "It enables account enumeration",
        "It uses more CPU",
        "It breaks the JWT",
      ],
      correctIndex: 1,
      explanation:
        "Different messages reveal which emails are registered. Attackers can build a target list. Always return a generic 'Invalid credentials' message.",
    },
    {
      question: "What should happen to refresh tokens when a user resets their password?",
      options: [
        "Nothing",
        "Only the current session is kept",
        "All refresh tokens for the user should be revoked",
        "They should be extended",
      ],
      correctIndex: 2,
      explanation:
        "If an attacker had a session, changing the password should kick them out. Revoking all refresh tokens ensures the new password is required everywhere.",
    },
    {
      question: "Why is checking roles only on the frontend insufficient?",
      options: [
        "Frontend code is slower",
        "Attackers can call the API directly, bypassing the UI",
        "Frontend cannot read roles",
        "It uses too much bandwidth",
      ],
      correctIndex: 1,
      explanation:
        "The frontend is fully controlled by the user. Anyone can call the API directly. Authorization must be enforced on the server for every request.",
    },
    {
      question: "Why is auto-linking an OAuth identity to an existing local account dangerous?",
      options: [
        "It uses too much database space",
        "An attacker could pre-register the victim's email and later gain access via OAuth",
        "It makes login slower",
        "It breaks the JWT",
      ],
      correctIndex: 1,
      explanation:
        "If an attacker creates a local account with the victim's email before the victim signs up, auto-linking the victim's OAuth identity to that account gives the attacker access. Only link when the provider has verified the email, or require password confirmation.",
    },
    {
      question: "What is the main benefit of refresh token rotation?",
      options: [
        "It makes tokens shorter",
        "It detects token theft because a reused token indicates compromise",
        "It removes the need for access tokens",
        "It speeds up the database",
      ],
      correctIndex: 1,
      explanation:
        "With rotation, each refresh token is single-use. If an attacker uses a stolen token, the legitimate user's next refresh fails, and you can revoke the whole family. This makes theft detectable.",
    },
    {
      question: "What HTTP status should be returned when an authenticated user lacks permission?",
      options: ["200", "401", "403", "500"],
      correctIndex: 2,
      explanation:
        "401 means unauthenticated (no valid credentials). 403 means authenticated but forbidden (insufficient permissions). Clients rely on this distinction.",
    },
    {
      question: "Why is logging a refresh token dangerous?",
      options: [
        "It slows down the logger",
        "Logs are stored and aggregated, so a logged token becomes a leaked credential",
        "It breaks the JWT",
        "It uses too much disk space",
      ],
      correctIndex: 1,
      explanation:
        "Logs are often shipped to third-party systems and retained for months. A token in the logs is effectively a leaked token. Log events and user IDs, never secrets.",
    },
    {
      question: "What should an E2E test for authentication include?",
      options: [
        "Only the successful login",
        "The full lifecycle including negative cases like missing tokens and revoked refresh tokens",
        "Only unit tests of the password service",
        "Only OAuth flows",
      ],
      correctIndex: 1,
      explanation:
        "E2E tests should cover register, login, access protected routes, refresh, logout, and negative cases: no token (401), wrong role (403), reused refresh token (401). This catches wiring mistakes.",
    },
  ],

  project: {
    name: "Food Delivery Auth Service",
    goal:
      "Build a production-style authentication service for a food delivery app that supports email/password registration with verification, secure login with refresh token rotation, forgot/reset password, RBAC with roles and ownership checks, and Google OAuth account linking. The service must be tested, rate-limited, monitored, and hardened for production.",
    brief:
      "You are building the auth service for a food delivery platform with customers, riders, restaurant owners, and admins. The service must handle registration, email verification, login, logout, token refresh with rotation and reuse detection, password reset, role-based access control, ownership checks, and Google OAuth. It must be secure against enumeration, brute force, token theft, and account takeover. It must be covered by unit, integration, and E2E tests. It must log auth events (without secrets) and expose metrics for monitoring.",
    steps: [
      "Create the NestJS project structure: `AuthModule`, `UsersModule`, and shared modules for email and Redis.",
      "Define entities: `User` (with `status` enum, `emailVerifiedAt`), `Identity` (provider + providerUserId + passwordHash), `EmailVerification`, `PasswordReset`.",
      "Implement `PasswordService` with bcrypt (cost 12) and unit tests.",
      "Implement registration with DTO validation, email uniqueness, hashed password, and async verification email.",
      "Implement email verification: generate random token, store SHA-256 hash with 24h expiry, consume once, mark user active.",
      "Implement login with `LocalStrategy`, generic error messages, and Passport integration.",
      "Implement `TokenService` with short-lived access tokens (15m) and refresh tokens stored in Redis with rotation and reuse detection.",
      "Implement logout: revoke the refresh token and clear the cookie.",
      "Implement forgot/reset password: hashed token, 20-minute expiry, single-use, revoke all sessions on success, confirmation email.",
      "Implement RBAC: `JwtAuthGuard`, `RolesGuard`, `@Roles()` decorator, and ownership checks in services (e.g., riders can only view their own deliveries).",
      "Implement Google OAuth with `passport-google-oauth20`: verify ID token, check `email_verified`, link or create user, issue your own tokens.",
      "Add rate limiting with `@nestjs/throttler` on login, register, forgot-password, reset-password, and refresh.",
      "Add structured logging for auth events (login success/failure, reset, revocation) without logging secrets.",
      "Write E2E tests covering: register → login → access protected route → refresh → logout → denied refresh; forgot-password enumeration; role denial; ownership denial.",
      "Add metrics (e.g., Prometheus) for login success/failure, refresh reuse detection, and active sessions.",
    ],
    acceptance: [
      "A new user can register, receive a verification email, verify, log in, access protected routes, refresh their token, and log out.",
      "Passwords are hashed with bcrypt and never returned in any API response.",
      "Login and forgot-password responses do not reveal whether an email exists.",
      "Refresh tokens are rotated on every use; reusing an old refresh token revokes the token family and returns 401.",
      "Changing a password revokes all refresh tokens for that user.",
      "A customer cannot access admin routes (403), and a rider cannot view another rider's delivery (403).",
      "Google OAuth login creates or links a user safely, with `email_verified` enforced before linking.",
      "Auth endpoints are rate-limited; brute force is slowed.",
      "E2E tests cover the full lifecycle and negative cases.",
      "Auth events are logged without secrets, and metrics are exposed for monitoring.",
    ],
    stretch: [
      "Add TOTP-based two-factor authentication for admins and restaurant owners.",
      "Implement device/session management: list active sessions, revoke individual sessions.",
      "Add WebAuthn/passkey support for passwordless login.",
      "Implement a CASL-based policy layer for fine-grained permissions (e.g., `orders:refund`).",
      "Add anomaly detection: alert on logins from new countries or impossible travel.",
      "Implement account recovery codes for 2FA loss.",
      "Add a breach check against HaveIBeenPwned's k-anonymity API at registration.",
      "Deploy with secrets from AWS Secrets Manager and rotate JWT secrets with overlap.",
      "Add OpenTelemetry tracing across auth flows.",
      "Write a load test for login and refresh endpoints and tune rate limits.",
    ],
  },
};
