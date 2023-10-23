import {
  describe, jest, expect, beforeEach, afterEach, test,
} from '@jest/globals';
import supertest from 'supertest';
import app from '../app.mjs';
import { startConnection, closeConnection } from '../mongo/index.mjs';

beforeEach(async () => {
  await startConnection();
});

afterEach(async () => {
  await closeConnection();
});

describe('Test app express server', () => {
  test('Test GET / should return ok', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('ok');
  });

  test('POST /images should return 200 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filter[]', 'greyscale')
      .field('filter[]', 'blur')
      .attach('images[]', 'src/__test__/samples/img1.jpeg');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filters');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updateAt');
  });

  test('POST /images should return 422 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'greyscale');

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('"images" must contain at least 1 items');
  });
});
