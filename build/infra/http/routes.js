"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/infra/http/routes.ts
var routes_exports = {};
__export(routes_exports, {
  routes: () => routes
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

// src/infra/prisma/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/core/errors/EmailAlreadyTakenError.ts
var EmailAlreadyTakenError = class extends Error {
  constructor() {
    super("Email already taken.");
  }
};

// src/core/usecases/SignupWithEmailConfirmation.ts
var import_bcryptjs = require("bcryptjs");

// src/core/lib/nodemailer.ts
var import_nodemailer = __toESM(require("nodemailer"));
var transport = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || ""),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};
var transporter = import_nodemailer.default.createTransport(transport);

// src/core/usecases/SignupWithEmailConfirmation.ts
var SignUpWithEmailConfirmation = class {
  async execute({ name, email, password }) {
    const smtpUser = process.env.SMTP_USER;
    const isEmailAlreadyTaken = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenError();
    }
    const passwordHash = await (0, import_bcryptjs.hash)(password, 6);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });
    const htmlTemplate = `
      <html>
        <body>
          <h3>Hello Mr(s) ${name},</h3>
          <p>
            Thank you for creating your NotionClient account. <br>
            To complete your registration, click the link below: <br>
            <a href='http://localhost:8080/v1/users/confirm-email/${user.publicId}'>Confirm your account here</a> <br>
          </p>
        </body>
      </html>
    `;
    await transporter.sendMail({
      from: smtpUser,
      to: email,
      subject: "[NotionClient] Email confirmation",
      html: htmlTemplate
    });
  }
};

// src/infra/http/controllers/SignupWithEmailConfirmationController.ts
var import_zod = require("zod");
var SignupWithEmailConfirmationController = class {
  async handle(request, reply) {
    const signupWithEmailConfirmationBodySchema = import_zod.z.object({
      name: import_zod.z.string(),
      email: import_zod.z.string().email(),
      password: import_zod.z.string()
    });
    try {
      const { name, email, password } = signupWithEmailConfirmationBodySchema.parse(request.body);
      const signupWithEmailConfirmation = new SignUpWithEmailConfirmation();
      await signupWithEmailConfirmation.execute({ name, email, password });
      return reply.status(201).send();
    } catch (err) {
      if (err instanceof import_zod.z.ZodError) {
        return reply.status(400).json({ message: "Validation error" });
      }
      if (err instanceof EmailAlreadyTakenError) {
        return reply.status(409).json(err.message);
      }
      return reply.status(400).json(err);
    }
  }
};

// src/core/errors/AccountAlreadyConfirmedError.ts
var AccountAlreadyConfirmedError = class extends Error {
  constructor() {
    super("Your account was already confirmed");
  }
};

// src/core/errors/ResourceNotFoundError.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/core/usecases/ConfirmEmail.ts
var ConfirmEmail = class {
  async execute({ publicId }) {
    const user = await prisma.user.findUnique({
      where: {
        publicId
      },
      select: {
        id: true,
        isEmailConfirmed: true
      }
    });
    if (user?.isEmailConfirmed) {
      throw new AccountAlreadyConfirmedError();
    }
    if (!user) {
      throw new ResourceNotFoundError();
    }
    await prisma.user.update({
      where: {
        publicId
      },
      data: {
        isEmailConfirmed: true
      }
    });
  }
};

// src/infra/http/controllers/ConfirmEmailController.ts
var import_zod2 = require("zod");
var ConfirmEmailController = class {
  async handle(request, reply) {
    const confirmEmailBodySchema = import_zod2.z.object({
      publicId: import_zod2.z.string().uuid()
    });
    try {
      const { publicId } = confirmEmailBodySchema.parse(request.body);
      const confirmEmail = new ConfirmEmail();
      await confirmEmail.execute({ publicId });
      return reply.status(301).redirect("http://localhost:8080/success");
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) {
        return reply.status(400).json({ message: "Validation error" });
      }
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message);
      }
      if (err instanceof AccountAlreadyConfirmedError) {
        return reply.status(400).json(err.message);
      }
      return reply.status(400).json(err);
    }
  }
};

// src/core/usecases/CreateSession.ts
var import_bcryptjs2 = require("bcryptjs");

// src/core/errors/InvalidCredentialsError.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid Credentials");
  }
};

// src/core/usecases/CreateSession.ts
var import_jsonwebtoken = require("jsonwebtoken");
var CreateSession = class {
  async execute({ email, password }) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const passwordMatched = await (0, import_bcryptjs2.compare)(password, user.passwordHash);
    if (!passwordMatched) {
      throw new InvalidCredentialsError();
    }
    const token = await (0, import_jsonwebtoken.sign)({}, secret, {
      subject: user.id,
      expiresIn
    });
    return {
      accessToken: token,
      user: {
        name: user.name,
        email: user.email
      }
    };
  }
};

// src/infra/http/controllers/CreateSessionController.ts
var import_zod3 = require("zod");
var CreateSessionController = class {
  async handle(request, reply) {
    const createSessionBodySchema = import_zod3.z.object({
      email: import_zod3.z.string().email(),
      password: import_zod3.z.string()
    });
    try {
      const { email, password } = createSessionBodySchema.parse(request.body);
      const createSession = new CreateSession();
      const token = await createSession.execute({ email, password });
      return reply.status(201).json(token);
    } catch (err) {
      if (err instanceof import_zod3.z.ZodError) {
        return reply.status(400).json({ message: "Validation error" });
      }
      if (err instanceof InvalidCredentialsError) {
        return reply.status(401).json(err.message);
      }
      return reply.status(400).json(err);
    }
  }
};

// src/core/usecases/CreatePublicKey.ts
var import_node_crypto = __toESM(require("crypto"));
var CreatePublicKey = class {
  async execute({
    secretKeyValue,
    databaseId,
    userId
  }) {
    const APIKey = await prisma.aPIKey.create({
      data: {
        value: secretKeyValue,
        notionDatabaseId: databaseId,
        userId
      }
    });
    if (!APIKey) {
      throw new ResourceNotFoundError();
    }
    const key = import_node_crypto.default.randomUUID();
    const publicKeyValue = "public_".concat(key);
    const publicKey = await prisma.publicKey.create({
      data: {
        value: publicKeyValue,
        apiKeyId: APIKey.id
      }
    });
    return {
      publicKey
    };
  }
};

// src/infra/http/controllers/CreatePublicKeyController.ts
var import_zod4 = require("zod");
var CreatePublicKeyController = class {
  async handle(request, reply) {
    const createPublicKeySubSchema = import_zod4.z.object({
      id: import_zod4.z.string().uuid()
    });
    const createPublicKeyBodySchema = import_zod4.z.object({
      secretKeyValue: import_zod4.z.string(),
      databaseId: import_zod4.z.string()
    });
    try {
      const { id: userId } = createPublicKeySubSchema.parse(request.sub);
      const { secretKeyValue, databaseId } = createPublicKeyBodySchema.parse(
        request.body
      );
      const createPublicKey = new CreatePublicKey();
      const publicKey = await createPublicKey.execute({
        secretKeyValue,
        databaseId,
        userId
      });
      return reply.json(publicKey);
    } catch (err) {
      if (err instanceof import_zod4.z.ZodError) {
        return reply.status(400).json({ message: "Validation error" });
      }
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message);
      }
      return reply.status(400).json(err);
    }
  }
};

// src/infra/http/middlewares/verifyToken.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
async function verifyToken(request, reply, next) {
  const authHeader = request.headers.authorization;
  const secret = process.env.JWT_SECRET;
  if (!authHeader) {
    return reply.status(401).json({ error: "Token is missing!" });
  }
  const [, accessToken] = authHeader.split(" ");
  try {
    const { sub } = (0, import_jsonwebtoken2.verify)(accessToken, secret);
    request.sub = {
      id: sub
    };
    return next();
  } catch {
    return reply.status(401).json({ error: "Token is invalid" });
  }
}

// src/core/usecases/QueryNotionDatabase.ts
var import_client2 = require("@notionhq/client");
var QueryNotionDatabase = class {
  async execute({ publicKey }) {
    const publicKeyExists = await prisma.publicKey.findUnique({
      where: {
        value: publicKey
      },
      include: {
        secretKey: true
      }
    });
    if (!publicKeyExists) {
      throw new ResourceNotFoundError();
    }
    const secretKeyValue = publicKeyExists.secretKey?.value;
    const notion = new import_client2.Client({ auth: secretKeyValue });
    const notionDatabaseId = publicKeyExists.secretKey?.notionDatabaseId;
    if (!notionDatabaseId) {
      throw new ResourceNotFoundError();
    }
    const response = await notion.databases.query({
      database_id: notionDatabaseId
    });
    return response;
  }
};

// src/infra/http/controllers/QueryNotionDatabaseController.ts
var import_zod5 = require("zod");
var QueryNotionDatabaseController = class {
  async handle(request, reply) {
    const queryNotionDatabaseBodySchema = import_zod5.z.object({
      publicKey: import_zod5.z.string()
    });
    try {
      const { publicKey } = queryNotionDatabaseBodySchema.parse(request.body);
      const queryNotionDatabase = new QueryNotionDatabase();
      const response = await queryNotionDatabase.execute({ publicKey });
      return reply.json(response);
    } catch (err) {
      if (err instanceof import_zod5.z.ZodError) {
        return reply.status(400).json({ message: "Validation error" });
      }
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message);
      }
      return reply.status(400).json(err);
    }
  }
};

// src/infra/http/routes.ts
var routes = (0, import_express.Router)();
var signupWithEmailConfirmationController = new SignupWithEmailConfirmationController();
var confirmEmailController = new ConfirmEmailController();
var createSessionController = new CreateSessionController();
var createPublicKeyController = new CreatePublicKeyController();
var queryNotionDatabaseController = new QueryNotionDatabaseController();
routes.post("/v1/users/sign-up", signupWithEmailConfirmationController.handle);
routes.get("/v1/users/confirm-email/:publicId", confirmEmailController.handle);
routes.post("/v1/sessions", createSessionController.handle);
routes.post("/v1/public-key", verifyToken, createPublicKeyController.handle);
routes.post("/v1/notion/database/query", queryNotionDatabaseController.handle);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routes
});
