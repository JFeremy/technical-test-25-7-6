import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as path from 'path';
import * as fs from 'fs';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/mowers-instructions (POST)', async () => {
    const filePath = path.join(__dirname, '..', 'mower_instructions.txt');
    const response = await request(app.getHttpServer())
      .post('/mowers-instructions')
      .attach('file', filePath)
      .expect(201);

    expect(response.text).toContain('1 3 N');
    expect(response.text).toContain('5 1 E');
  });
});
