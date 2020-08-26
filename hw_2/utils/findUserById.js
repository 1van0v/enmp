export function findUserById(users, id) {
    const user = users.find((i) => i.id === id);

    if (!user) {
        throw new Error(`Cannot find a user with ID ${id}`);
    }

    return user;
}
