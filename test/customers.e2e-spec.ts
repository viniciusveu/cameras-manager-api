import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CustomersController (e2e)', () => {
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

  describe('/customers (POST)', () => {
    it('should return 201', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Customer31', password: 'Password31!', id: '67860b7f-c151-4f87-9ec6-e3216516e3bf' })
        .expect(201);
    });
  });

  it('/customers (GET)', () => {
    return request(app.getHttpServer())
      .get('/customers')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  describe('/customers/:id (GET)', () => {

    it('should return 200', () => {
      return request(app.getHttpServer())
        .get('/customers/67860b7f-c151-4f87-9ec6-e3216516e3bf')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 200 when do not found', () => {
      return request(app.getHttpServer())
        .get('/customers/67860b7f-c151-4f87-9ec6-e3216516e3bf')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

  });

  describe('/customers/:id/cameras (GET)', () => {

    it('should return 200', () => {
      return request(app.getHttpServer())
        .get('/customers/67860b7f-c151-4f87-9ec6-e3216516e3bf/cameras')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 200 when do not found', () => {
      return request(app.getHttpServer())
        .get('/customers/67860b7f-c151-4f87-9ec6-e3216516e3bf/cameras')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

  });

  afterEach(async () => {
    await app.close();
  });

});
