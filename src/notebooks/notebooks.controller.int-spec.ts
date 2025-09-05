import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotebooksModule } from './notebooks.module';
import { Notebook } from './entities/notebook.entity';

describe('NotebooksController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NotebooksModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '421223', // tu password
          database: 'jest_olava', // tu DB creada
          entities: [Notebook],
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET notebooks → should return empty array initially', async () => {
    return request(app.getHttpServer())
      .get('/notebooks')
      .expect(HttpStatus.OK)
      .expect([]);
  });

  it('/POST notebooks → should create a notebook', async () => {
    const dto = { title: 'Test Notebook', content: 'Test Content' };
    return request(app.getHttpServer())
      .post('/notebooks')
      .send(dto)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(dto.title);
        expect(response.body.content).toBe(dto.content);
      });
  });

  it('/GET notebooks → should return array with the created notebook', async () => {
    return request(app.getHttpServer())
      .get('/notebooks')
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Test Notebook');
      });
  });
});