import { v4 as uuid } from 'uuid';

export const users = new Array(20).fill().map((value, index) => ({
    id: uuid(),
    login: `user_login_${  index}`,
    password: `user_secret_${  index}`,
    age: 18 + index,
    isDeleted: !Boolean(index % 5)
}));
