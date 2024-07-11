"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuth = exports.create = void 0;
const jwt_1 = __importDefault(require("@hapi/jwt"));
const create = (address, chainId) => {
    return jwt_1.default.token.generate({
        address: address,
        chainId: chainId,
        iss: "api-dev.defactor.dev",
        "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user", "admin"],
        },
    }, {
        key: "some-very-secret-key",
        algorithm: "HS256",
    }, {
        ttlSec: 14400, //4h
        iat: true,
    });
};
exports.create = create;
const configureAuth = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.register(jwt_1.default);
    server.auth.strategy("jwt_strategy", "jwt", {
        cookieName: "token",
        keys: "some-very-secret-key",
        verify: {
            aud: false,
            iss: "api-dev.defactor.dev",
            sub: false,
            nbf: true,
            exp: true,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate: (artifacts) => __awaiter(void 0, void 0, void 0, function* () {
            const address = artifacts.decoded.payload.address;
            const chainId = artifacts.decoded.payload.chainId;
            const role = artifacts.decoded.payload["https://hasura.io/jwt/claims"]["x-hasura-default-role"];
            return {
                isValid: true,
                credentials: {
                    address,
                    chainId,
                    role,
                },
            };
        }),
    });
});
exports.configureAuth = configureAuth;
