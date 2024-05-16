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

// src/infra/http/controllers/ConfirmEmailController.ts
var ConfirmEmailController_exports = {};
__export(ConfirmEmailController_exports, {
  ConfirmEmailController: () => ConfirmEmailController
});
module.exports = __toCommonJS(ConfirmEmailController_exports);

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

// src/infra/http/controllers/ConfirmEmailController.ts
var import_zod = require("zod");
var ConfirmEmailController = class {
  async handle(request, reply) {
    const confirmEmailBodySchema = import_zod.z.object({
      publicId: import_zod.z.string().uuid()
    });
    try {
      const { publicId } = confirmEmailBodySchema.parse(request.body);
      const confirmEmail = new ConfirmEmail();
      await confirmEmail.execute({ publicId });
      return reply.status(301).redirect("http://localhost:8080/success");
    } catch (err) {
      if (err instanceof import_zod.z.ZodError) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConfirmEmailController
});
