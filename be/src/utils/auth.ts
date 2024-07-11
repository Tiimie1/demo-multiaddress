import { Server } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import { getUsersByAddress } from "../api/getUserByAddress.js";

export const create = async (address: string, chainId: number) => {
  let role = await getUsersByAddress(address);

  if (!role) {
    role = "user";
  }

  return Jwt.token.generate(
    {
      address: address,
      chainId: chainId,
      iss: "api-dev.defactor.dev",
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": role,
        "x-hasura-allowed-roles": ["user", "admin"],
      },
    },
    {
      key: "some-very-secret-key",
      algorithm: "HS256",
    },
    {
      ttlSec: 14400, //4h
      iat: true,
    },
  );
};

export const configureAuth = async (server: Server) => {
  await server.register(Jwt);

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
    validate: async (artifacts: any) => {
      const address = artifacts.decoded.payload.address;
      const chainId = artifacts.decoded.payload.chainId;
      const role =
        artifacts.decoded.payload["https://hasura.io/jwt/claims"][
          "x-hasura-default-role"
        ];

      return {
        isValid: true,
        credentials: {
          address,
          chainId,
          role,
        },
      };
    },
  });
};
