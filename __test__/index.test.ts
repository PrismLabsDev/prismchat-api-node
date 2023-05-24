import server from '../app/server';
import request from 'supertest';

describe('GET default route', () => {
	it('Returns text when accessed.', async () => {
		const res = await request(server.app).get('/');
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual('Welcome to your TS Web App.');
	});
});
