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

// src/infra/http/controllers/CreatePublicKeyController.ts
var CreatePublicKeyController_exports = {};
__export(CreatePublicKeyController_exports, {
  CreatePublicKeyController: () => CreatePublicKeyController
});
module.exports = __toCommonJS(CreatePublicKeyController_exports);

// src/infra/prisma/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/core/errors/ResourceNotFoundError.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
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
var import_zod = require("zod");
var CreatePublicKeyController = class {
  async handle(request, reply) {
    const createPublicKeySubSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
    });
    const createPublicKeyBodySchema = import_zod.z.object({
      secretKeyValue: import_zod.z.string(),
      databaseId: import_zod.z.string()
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
      if (err instanceof import_zod.z.ZodError) {
        return reply.status(400).json({ message: "Validation error" });
      }
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message);
      }
      return reply.status(400).json(err);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreatePublicKeyController
});
