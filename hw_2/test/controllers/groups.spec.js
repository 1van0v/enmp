import request from 'supertest';
import express from 'express';

jest.mock('../../services/groups.service');

import { groupsService } from '../../services/groups.service';
import { groupsRouter } from '../../controllers';

describe('Groups Controller', () => {
    let testApp;

    beforeEach(() => {
        testApp = express();
        testApp.use(express.json());
        testApp.use(groupsRouter);
    });

    test('It should return all groups on GET request', (done) => {
        const testResponse = ['group1', 'group2'];
        groupsService.getGroups = jest.fn();
        groupsService.getGroups.mockReturnValue(Promise.resolve(testResponse));

        request(testApp)
            .get('/')
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(groupsService.getGroups).toHaveBeenCalled();
                expect(res.body).toEqual(testResponse);
                done();
            });
    });

    test('It should return the group details', (done) => {
        const testGroup = { name: 'testGroup' };
        groupsService.getGroup = jest.fn();
        groupsService.getGroup.mockReturnValue(Promise.resolve(testGroup));

        request(testApp)
            .get('/1')
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(groupsService.getGroup).toHaveBeenCalledWith('1');
                expect(res.body).toEqual(testGroup);
                done();
            });
    });

    describe('add group', () => {
        beforeEach(() => {
            groupsService.addGroup = jest.fn();
        });

        test('It should return added group', (done) => {
            const groupToAdd = { name: 'test', permissions: ['READ'] };
            const addedGroup = { id: 1, ...groupToAdd };
            groupsService.addGroup.mockReturnValue(Promise.resolve(addedGroup));

            request(testApp)
                .post('/')
                .send(groupToAdd)
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(groupsService.addGroup).toHaveBeenCalled();
                    expect(res.body).toEqual(addedGroup);
                    done();
                });
        });

        test('It should not call addGroup method for empty body', (done) => {
            const groupToUpdate = {};

            request(testApp)
                .put('/1')
                .send(groupToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(groupsService.addGroup).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call addGroup method if name has less than 1 character', (done) => {
            const groupToUpdate = { name: '' };

            request(testApp)
                .put('/1')
                .send(groupToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(groupsService.addGroup).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call addGroup method if permissions have invalid permission', (done) => {
            const groupToUpdate = { permissions: ['invalid'] };

            request(testApp)
                .put('/1')
                .send(groupToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(groupsService.addGroup).not.toHaveBeenCalled();
                    done();
                });
        });
    });

    describe('update group', () => {
        beforeEach(() => {
            groupsService.updateGroup = jest.fn();
        });

        test('It should return updated group', (done) => {
            const groupToUpdate = { name: 'test', permissions: ['WRITE'] };
            const updatedGroup = { id: 1, ...groupToUpdate };
            groupsService.updateGroup.mockReturnValue(
                Promise.resolve(updatedGroup)
            );

            request(testApp)
                .put('/1')
                .send(groupToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(groupsService.updateGroup).toHaveBeenCalled();
                    expect(res.body).toEqual(updatedGroup);
                    done();
                });
        });

        test('It should not call updateGroup method for empty body', (done) => {
            const groupToUpdate = {};

            request(testApp)
                .put('/1')
                .send(groupToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(groupsService.updateGroup).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call updateGroup method if name has less than 1 character', (done) => {
            const groupToUpdate = { name: '' };

            request(testApp)
                .put('/1')
                .send(groupToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(groupsService.updateGroup).not.toHaveBeenCalled();
                    done();
                });
        });

        test('It should not call updateGroup method if permissions have invalid permission', (done) => {
            const groupToUpdate = { permissions: ['test'] };

            request(testApp)
                .put('/1')
                .send(groupToUpdate)
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(groupsService.updateGroup).not.toHaveBeenCalled();
                    done();
                });
        });
    });

    describe('delete group', () => {
        beforeEach(() => {
            groupsService.deleteGroup = jest.fn();
        });

        test('it should return deleted group', (done) => {
            groupsService.deleteGroup.mockReturnValue();

            request(testApp)
                .delete('/1')
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(groupsService.deleteGroup).toHaveBeenCalledWith('1');
                    done();
                });
        });
    });

    describe('add users to group', () => {
        beforeEach(() => {
            groupsService.addUsersToGroup = jest.fn();
        });

        test('it should return 200 when users were added', (done) => {
            const userIds = [2];
            request(testApp)
                .post('/1/users')
                .send({ userIds })
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(groupsService.addUsersToGroup).toHaveBeenCalledWith(
                        '1',
                        userIds
                    );
                    done();
                });
        });

        test('it should return 500 when addUsersToGroup throws error', (done) => {
            const userIds = [3];
            groupsService.addUsersToGroup.mockRejectedValue(
                new Error('test error')
            );

            request(testApp)
                .post('/4/users')
                .send({ userIds })
                .then((res) => {
                    expect(res.statusCode).toBe(500);
                    expect(groupsService.addUsersToGroup).toHaveBeenCalledWith(
                        '4',
                        userIds
                    );
                    done();
                });
        });
    });
});
