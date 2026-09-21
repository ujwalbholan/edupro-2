import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, beforeEach } from '@jest/globals';
import { Server } from 'node:http';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/v1/health/live (GET)', () => {
    return request(app.getHttpServer() as Server)
      .get('/v1/health/live')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(body.timestamp).toEqual(expect.any(String));
      });
  });
});
