"use strict";

import Hapi from "@hapi/hapi";
import { generateNonce, SiweMessage } from "siwe";
import { configureAuth, create } from "./utils/auth.js";
import { getUsersByAddress } from "./api/getUserByAddress.js";

const init = async () => {
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

  await configureAuth(server);

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
    handler: async (request, h) => {
      try {
        const { address } = request.payload as { address: string };
        const usr = getUsersByAddress(address);
        return usr;
      } catch (error) {
        console.error(error);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/api/session",
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      try {
        return request.auth.credentials;
      } catch {
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
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
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
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { message, signature, address, chainId } = request.payload as {
        message: string;
        signature: string;
        address: string;
        chainId: number;
      };
      const siweMessage = new SiweMessage(message);
      try {
        await siweMessage.verify({ signature });
        const token = await create(address, chainId);

        return h.response({ success: true }).state("token", token, {
          isHttpOnly: true,
          isSecure: false,
          clearInvalid: true,
          path: "/",
          isSameSite: "Strict",
        });
      } catch {
        return { success: false };
      }
    },
  });

  server.route({
    method: "GET",
    path: "/api/nonce",
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const nonce = generateNonce();
      return { nonce };
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
