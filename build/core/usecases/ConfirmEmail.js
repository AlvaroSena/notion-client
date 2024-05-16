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

// src/core/usecases/ConfirmEmail.ts
var ConfirmEmail_exports = {};
__export(ConfirmEmail_exports, {
  ConfirmEmail: () => ConfirmEmail
});
module.exports = __toCommonJS(ConfirmEmail_exports);

// src/infra/prisma/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConfirmEmail
});
