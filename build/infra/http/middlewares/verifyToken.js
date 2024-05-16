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

// src/infra/http/middlewares/verifyToken.ts
var verifyToken_exports = {};
__export(verifyToken_exports, {
  verifyToken: () => verifyToken
});
module.exports = __toCommonJS(verifyToken_exports);
var import_jsonwebtoken = require("jsonwebtoken");
async function verifyToken(request, reply, next) {
  const authHeader = request.headers.authorization;
  const secret = process.env.JWT_SECRET;
  if (!authHeader) {
    return reply.status(401).json({ error: "Token is missing!" });
  }
  const [, accessToken] = authHeader.split(" ");
  try {
    const { sub } = (0, import_jsonwebtoken.verify)(accessToken, secret);
    request.sub = {
      id: sub
    };
    return next();
  } catch {
    return reply.status(401).json({ error: "Token is invalid" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  verifyToken
});
