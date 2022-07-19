const app = require('../src/server/server')
const supertest = require('supertest');
const request = supertest(app);
it('', async () => {
    await request.get("/test")
        .expect(200)
        .then((response) =>
            expect(response.body.msg).toBe('Done!'))
})