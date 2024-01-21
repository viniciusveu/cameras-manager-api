import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CamerasController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'User0', password: 'Password0!' });

    token = response.body.access_token;
  });

  it('/cameras (POST)', () => {
    return request(app.getHttpServer())
      .get('/cameras')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Camera0', ip: '000.000.000.000', customer_id: '67860b7f-c151-4f87-9ec6-e3216516e3bf' })
      .expect(404);
  });

  afterEach(async () => {
    await app.close();
  });

});
