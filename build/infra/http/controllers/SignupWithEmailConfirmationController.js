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

// src/infra/http/controllers/SignupWithEmailConfirmationController.ts
var SignupWithEmailConfirmationController_exports = {};
__export(SignupWithEmailConfirmationController_exports, {
  SignupWithEmailConfirmationController: () => SignupWithEmailConfirmationController
});
module.exports = __toCommonJS(SignupWithEmailConfirmationController_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SignupWithEmailConfirmationController
});
