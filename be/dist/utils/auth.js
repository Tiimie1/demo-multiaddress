var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Jwt from "@hapi/jwt";
import { getUsersByAddress } from "../api/getUserByAddress.js";
export const create = (address, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    let role = yield getUsersByAddress(address);
    if (!role) {
        role = "user";
    }
    return Jwt.token.generate({
        address: address,
        chainId: chainId,
        iss: "api-dev.defactor.dev",
        "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": role,
            "x-hasura-allowed-roles": ["user", "admin"],
        },
    }, {
        key: "some-very-secret-key",
        algorithm: "HS256",
    }, {
        ttlSec: 14400, //4h
        iat: true,
    });
});
export const configureAuth = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.register(Jwt);
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
