export function getAutoSuggestUsers(users, loginSubstring, limit) {
    const lookupStr = loginSubstring.toLowerCase();
    return users
        .filter((i) => i.login.toLowerCase().includes(lookupStr))
        .sort((a, b) => {
            if (a.login < b.login) {
                return -1;
            }
            if (a.login > b.login) {
                return 1;
            }

            return 0;
        })
        .slice(0, limit);
}
