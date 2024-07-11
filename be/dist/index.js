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
import Hapi from "@hapi/hapi";
import { generateNonce, SiweMessage } from "siwe";
import { configureAuth, create } from "./utils/auth.js";
import { getUsersByAddress } from "./api/getUserByAddress.js";
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = Hapi.server({
        port: 8000,
        host: "0.0.0.0",
        routes: {
            cors: {
                origin: ["*"],
                headers: ["Accept", "Content-Type"],
                exposedHeaders: ["WWW-Authenticate", "Server-Authorization"],
                additionalExposedHeaders: ["x-custom-header"],
                maxAge: 60,
                credentials: true,
            },
        },
    });
    yield configureAuth(server);
    server.route({
        method: "GET",
        path: "/",
        handler: (request, h) => {
            return "Hello World!";
        },
        options: {
            auth: "jwt_strategy",
        },
    });
    server.route({
        method: "POST",
        path: "/usr",
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { address } = request.payload;
                const usr = getUsersByAddress(address);
                return usr;
            }
            catch (error) {
                console.error(error);
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        }),
    });
    server.route({
        method: "GET",
        path: "/api/session",
        handler: (request, h) => {
            try {
                return request.auth.credentials;
            }
            catch (_a) {
                return null;
            }
        },
        options: {
            auth: "jwt_strategy",
        },
    });
    server.route({
        method: "DELETE",
        path: "/api/session",
        handler: (request, h) => {
            h.unstate("token", {
                isHttpOnly: true,
                isSecure: false,
                clearInvalid: true,
                path: "/",
                isSameSite: "Strict",
            });
            return { message: "Stored data cleared successfully" };
        },
    });
    server.route({
        method: "POST",
        path: "/api/verify",
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            const { message, signature, address, chainId } = request.payload;
            const siweMessage = new SiweMessage(message);
            try {
                yield siweMessage.verify({ signature });
                const token = yield create(address, chainId);
                return h.response({ success: true }).state("token", token, {
                    isHttpOnly: true,
                    isSecure: false,
                    clearInvalid: true,
                    path: "/",
                    isSameSite: "Strict",
                });
            }
            catch (_a) {
                return { success: false };
            }
        }),
    });
    server.route({
        method: "GET",
        path: "/api/nonce",
        handler: (request, h) => {
            const nonce = generateNonce();
            return { nonce };
        },
    });
    yield server.start();
    console.log("Server running on %s", server.info.uri);
});
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});
init();
