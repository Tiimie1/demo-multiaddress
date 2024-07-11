var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { gql } from "graphql-request";
import { fetchFromHasura } from "../utils/hasura.js";
export const getUserByAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const query = gql `
    query ($address: String!) {
      users_users(where: { address: { _eq: $address } }) {
        address
        role
      }
    }
  `;
    const variables = { address };
    return yield fetchFromHasura(query, variables);
});
