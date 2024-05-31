"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/core/usecases/CreateSession.ts
var CreateSession_exports = {};
__export(CreateSession_exports, {
  CreateSession: () => CreateSession
});
module.exports = __toCommonJS(CreateSession_exports);
var import_bcryptjs = require("bcryptjs");

// src/infra/prisma/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

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
    const passwordMatched = await (0, import_bcryptjs.compare)(password, user.passwordHash);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateSession
});
