var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const getUsersByAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:8080/api/rest/get-user-by-address", {
            method: "POST",
            headers: {
                "x-hasura-admin-secret": "myadminsecretkey",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address }),
        });
        if (!response.ok) {
            throw new Error("Failed to get user!");
        }
        const data = yield response.json();
        if (data.users_users.length == 0) {
            return "";
        }
        const user = data.users_users[0];
        return user.role;
    }
    catch (error) {
        throw new Error(`Failed to get user! ${error}`);
    }
});
