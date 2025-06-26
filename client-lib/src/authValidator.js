"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.authSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).required().messages({
        "string.base": `"username" must be a string`,
        "string.min": `"username" should have at least 3 characters`,
        "any.required": `"username" is required`,
    }),
    password: joi_1.default.string().min(4).required().messages({
        "string.min": `"password" should have at least 4 characters`,
        "any.required": `"password" is required`,
    }),
});
