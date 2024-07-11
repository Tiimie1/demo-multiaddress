var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GraphQLClient } from "graphql-request";
const HAPI_HASURA_URL = "http://locahost:8080/v1/graphql";
const HAPI_HASURA_ADMIN_SECRET = "myadminsecretkey";
const client = new GraphQLClient(HAPI_HASURA_URL, {
    headers: {
        "x-hasura-admin-secret": HAPI_HASURA_ADMIN_SECRET,
    },
});
export const fetchFromHasura = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, variables = {}) {
    try {
        const data = yield client.request(query, variables);
        return data;
    }
    catch (error) {
        throw new Error(`Hasura request failed: ${error.message}`);
    }
});
