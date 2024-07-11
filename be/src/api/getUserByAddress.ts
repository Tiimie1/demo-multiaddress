export const getUsersByAddress = async (address: string) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/rest/get-user-by-address",
      {
        method: "POST",
        headers: {
          "x-hasura-admin-secret": "myadminsecretkey",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to get user!");
    }
    const data = await response.json();

    if (data.users_users.length == 0) {
      return "";
    }
    const user = data.users_users[0];
    return user.role;
  } catch (error) {
    throw new Error(`Failed to get user! ${error}`);
  }
};
