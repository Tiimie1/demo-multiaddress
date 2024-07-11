export const getUsersByAddress = (address) => {
    fetch("http://localhost:8080/api/rest/get-user-by-address", {
        method: "POST",
        headers: {
            "x-hasura-admin-secret": "myadminsecretkey",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
        redirect: "follow",
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
};
