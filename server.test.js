const request = require('supertest')
const app = require('./server.js')

describe('API User Endpoints', () => {
    xtest('create a new user (unique-email)', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                "name": "test",
                "active": true,
                "email": "test@test.fr",
                "password": "test"
            });
        expect(res.statusCode).toEqual(201);
    });
    xtest('update user with ID 1', async () => {
        const res = await request(app)
            .put('/api/users/1')
            .send({
                "name": "test_modified",
                "active": true,
                "email": "test@test.fr",
                "password": "test"
            });
        expect(res.statusCode).toEqual(200);
    });
    xtest('get user with ID 1', async () => {
        const res = await request(app)
            .get('/api/users/1')
        expect(res.body).toMatchObject({
            "name": "test_modified",
            "active": true,
            "email": "test@test.fr",
            "password": "test"
        });
        expect(res.statusCode).toEqual(200);
    });
    xtest('create second user & get all users', async () => {
        //Insert on more user
        const insert = await request(app)
            .post('/api/users').send({
                "name": "test2",
                "active": true,
                "email": "test2@test2.fr",
                "password": "test2"
            });
        const res = await request(app)
            .get('/api/users')
        expect(res.body.length).toBe(2);
        expect(res.statusCode).toEqual(200);
    });
    xtest('delete user with ID 2', async () => {
        const res = await request(app)
            .delete('/api/users/2');
        expect(res.statusCode).toEqual(200);
    });
    xtest('delete all users', async () => {
        const res = await request(app)
            .delete('/api/users');
        expect(res.statusCode).toEqual(200);
    });
});

describe('API Post Endpoints', () => {
    xtest('create a new post', async () => {
        const res = await request(app)
            .post('/api/posts')
            .send({
                "title": "test",
                "published": true,
                "description": "test",
                "user_id": 1
            });
        expect(res.statusCode).toEqual(201);
    });
    xtest('update post with ID 1', async () => {
        const res = await request(app)
            .put('/api/posts/1')
            .send({
                "title": "test_modified",
                "published": true,
                "description": "test"
            });
        expect(res.statusCode).toEqual(200);
    });
    xtest('get post with ID 1', async () => {
        const res = await request(app)
            .get('/api/posts/1')
        expect(res.body).toMatchObject({
            "title": "test_modified",
            "published": true,
            "description": "test"
        });
        expect(res.statusCode).toEqual(200);
    });
    xtest('create second post & get all posts', async () => {
        //Insert on more post
        const insert = await request(app)
            .post('/api/posts').send({
                "title": "test2",
                "published": false,
                "description": "test2"
            });
        const res = await request(app)
            .get('/api/posts')
        expect(res.body.length).toBe(2);
        expect(res.statusCode).toEqual(200);
    });
    xtest('get all published posts', async () => {
        const res = await request(app)
            .get('/api/posts/published')
        expect(res.body.length).toBe(1);
        expect(res.statusCode).toEqual(200);
    });
    xtest('delete post with ID 2', async () => {
        const res = await request(app)
            .delete('/api/posts/2');
        expect(res.statusCode).toEqual(200);
    });
    xtest('delete all posts', async () => {
        const res = await request(app)
            .delete('/api/posts');
        expect(res.statusCode).toEqual(200);
    });
});

describe('API Tag Endpoints', () => {
    xtest('create a new tag', async () => {
        const res = await request(app)
            .post('/api/tags')
            .send({
                "name": "tag",
                "description": "tag_description"
            });
        expect(res.statusCode).toEqual(201);
    });
    xtest('update tag with ID 1', async () => {
        const res = await request(app)
            .put('/api/tags/1')
            .send({
                "name": "tag_modified",
                "description": "tag_description"
            });
        expect(res.statusCode).toEqual(200);
    });
    xtest('create second tag & get all tags', async () => {
        //Insert on more tag
        const insert = await request(app)
            .post('/api/tags').send({
                "name": "tag2",
                "description": "tag_description2"
            });
        const res = await request(app)
            .get('/api/tags')
        expect(res.body.length).toBe(2);
        expect(res.statusCode).toEqual(200);
    });
    xtest('delete tag with ID 2', async () => {
        const res = await request(app)
            .delete('/api/tags/2');
        expect(res.statusCode).toEqual(200);
    });
    xtest('delete all tags', async () => {
        const res = await request(app)
            .delete('/api/tags');
        expect(res.statusCode).toEqual(200);
    });
});
 
describe('API tag/post Endpoints', () => {
    test('create a new tag/post association', async () => {
        /*const ins = await request(app)
            .post('/api/tags')
            .send({
                "name": "tag",
                "description": "tag_description"
            });
        expect(ins.statusCode).toEqual(201);
        const ins2 = await request(app)
            .post('/api/posts')
            .send({
                "title": "test",
                "published": true,
                "description": "test"
            });
        expect(ins2.statusCode).toEqual(201);*/
        const res = await request(app)
            .post('/api/posts/tags')
            .send({
                "postId": 1,
                "tagId": 1
            });
        expect(res.statusCode).toEqual(201);
    });
    xtest('avoid same tag/post association ', async () => {
        const ins = await request(app)
            .post('/api/posts/tags')
            .send({
                "postId": 3,
                "tagId": 3
            });
        expect(ins.statusCode).toEqual(201);
        const res = await request(app)
            .get('/api/posts/3')
        
        expect(res.body.tags.length).toBe(1);
        expect(res.statusCode).toEqual(200);
    });
});