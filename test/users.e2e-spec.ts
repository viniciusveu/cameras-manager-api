import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
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

  describe('/users (POST)', () => {
    it('should return 201', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'User31', password: 'Password31!', id: '67860b7f-c151-4f87-9ec6-e3216516e3bf' })
        .expect(201);
    });

    it('should return 409', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'User31', password: 'Password31!' })
        .expect(409);
    });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  describe('/users/:id (GET)', () => {

    it('should return 200', () => {
      return request(app.getHttpServer())
        .get('/users/67860b7f-c151-4f87-9ec6-e3216516e3bf')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 200 when do not found', () => {
      return request(app.getHttpServer())
        .get('/users/UserIDThatDoesNotExist')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });


  describe('/users/:id (PUT)', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .put('/users/67860b7f-c151-4f87-9ec6-e3216516e3bf')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'User31', password: 'Password31!!!' })
        .expect(200);
    });

    it('should return 404', () => {
      return request(app.getHttpServer())
        .put('/users/UserIDThatDoesNotExist')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'User31', password: 'Password31!!!' })
        .expect(404);
    });
  });

  describe('/users/:id (DELETE)', () => {

    it('should return 200', () => {
      return request(app.getHttpServer())
        .delete('/users/67860b7f-c151-4f87-9ec6-e3216516e3bf')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404', () => {
      return request(app.getHttpServer())
        .delete('/users/UserIDThatDoesNotExist')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  afterEach(async () => {
    await app.close();
  });

});
