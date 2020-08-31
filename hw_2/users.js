export const users = new Array(20).fill().map((value, index) => [
    `user_login_${index}`, // login
    `user_secret_${index}`, // password
    18 + index, // age
    !Boolean(index % 5) // isDeleted
]);
