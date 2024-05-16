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

// src/core/usecases/QueryNotionDatabase.ts
var QueryNotionDatabase_exports = {};
__export(QueryNotionDatabase_exports, {
  QueryNotionDatabase: () => QueryNotionDatabase
});
module.exports = __toCommonJS(QueryNotionDatabase_exports);

// src/infra/prisma/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/core/errors/ResourceNotFoundError.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QueryNotionDatabase
});
