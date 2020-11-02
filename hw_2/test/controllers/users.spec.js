import request from 'supertest';
import express from 'express';

jest.mock('../../services/users.service');

import { usersService } from '../../services/users.service';
import { usersRouter } from '../../controllers';

describe('Users Controller', () => {
    let testApp;

    beforeEach(() => {
        testApp = express();
        testApp.use(express.json());
        testApp.use(usersRouter);
    });

    test('It should return all users on GET request', (done) => {
        const testResponse = ['user1', 'user2'];
        usersService.getUsers = jest.fn();
        usersService.getUsers.mockReturnValue(Promise.resolve(testResponse));

        request(testApp)
            .get('/')
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(usersService.getUsers).toHaveBeenCalled();
                expect(res.body).toEqual({ users: testResponse });
                done();
            });
    });

    test('It should return filtered users if loginSubstring and limit are specified', (done) => {
        const filtered = ['filteredUser'];
        usersService.getSuggestions = jest.fn();
        usersService.getSuggestions.mockReturnValue(Promise.resolve(filtered));

        request(testApp)
            .get('/?loginSubstring=t&limit=1')
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(usersService.getSuggestions).toHaveBeenCalled();
                expect(res.body).toEqual({ users: filtered });
                done();
            });
    });

    describe('get user', () => {
        beforeEach(() => {
            usersService.getUser = jest.fn();
        });

        test('It should return the user details', (done) => {
            const testUser = { name: 'testUser' };
            usersService.getUser.mockReturnValue(Promise.resolve(testUser));

            request(testApp)
                .get('/1')
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(usersService.getUser).toHaveBeenCalledWith('1');
                    expect(res.body).toEqual(testUser);
                    done();
                });
        });

        test('It should return error if there is no user with requested id', (done) => {
            usersService.getUser.mockReturnValue(Promise.resolve(null));

            request(testApp)
                .get('/1')
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.getUser).toHaveBeenCalledWith('1');
                    done();
                });
        });
    });

    describe('add user', () => {
        beforeEach(() => {
            usersService.addUser = jest.fn();
        });

        test('It should return added user', (done) => {
            const userToAdd = { login: 'test', password: 'secret', age: 12 };
            const addedUser = { id: 1, ...userToAdd };
            usersService.addUser.mockReturnValue(Promise.resolve(addedUser));

            request(testApp)
                .post('/')
                .send(userToAdd)
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(usersService.addUser).toHaveBeenCalled();
                    expect(res.body).toEqual(addedUser);
                    done();
                });
        });

        test('It should not call addUser method for empty body', (done) => {
            const userToUpdate = {};

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.addUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call addUser method if login has less than 1 character', (done) => {
            const userToUpdate = { login: '' };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.addUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call addUser method if password has less than 1 character', (done) => {
            const userToUpdate = { password: '' };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.addUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call addUser method if age is less than 4', (done) => {
            const userToUpdate = { age: 3 };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.addUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call addUser method if isDelete is not boolean', (done) => {
            const userToUpdate = { isDeleted: 3 };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.addUser).not.toHaveBeenCalled();
                    done();
                });
        });
    });

    describe('update user', () => {
        beforeEach(() => {
            usersService.updateUser = jest.fn();
        });

        test('It should return updated user', (done) => {
            const userToUpdate = { login: 'test', password: 'secret', age: 12 };
            const updatedUser = { id: 1, ...userToUpdate };
            usersService.updateUser.mockReturnValue(
                Promise.resolve(updatedUser)
            );

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(usersService.updateUser).toHaveBeenCalled();
                    expect(res.body).toEqual(updatedUser);
                    done();
                });
        });

        test('It should not call updateUser method for empty body', (done) => {
            const userToUpdate = {};

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.updateUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call updateUser method if login has less than 1 character', (done) => {
            const userToUpdate = { login: '' };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.updateUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call updateUser method if password has less than 1 character', (done) => {
            const userToUpdate = { password: '' };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.updateUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call updateUser method if age is less than 4', (done) => {
            const userToUpdate = { age: 3 };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.updateUser).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call updateUser method if isDelete is not boolean', (done) => {
            const userToUpdate = { isDeleted: 3 };

            request(testApp)
                .put('/1')
                .send(userToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(usersService.updateUser).not.toHaveBeenCalled();
                    done();
                });
        });
    });

    describe('delete user', () => {
        beforeEach(() => {
            usersService.deleteUser = jest.fn();
        });

        test('it should return deleted user', (done) => {
            const deletedUser = { isDeleted: true };
            usersService.deleteUser.mockReturnValue(deletedUser);

            request(testApp)
                .delete('/1')
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(usersService.deleteUser).toHaveBeenCalledWith('1');
                    expect(res.body).toEqual(deletedUser);
                    done();
                });
        });
    });
});
