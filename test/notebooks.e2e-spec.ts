import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateNotebookDto } from './../src/notebooks/dto/create-notebook.dto';

describe('NotebooksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 🔴 Activar la validación global para los e2e tests
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/notebooks (GET) should return an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/notebooks')
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/notebooks (POST) should create a notebook', async () => {
    const createDto: CreateNotebookDto = {
      title: 'Test Notebook',
      content: 'Contenido de prueba',
    };

    const response = await request(app.getHttpServer())
      .post('/notebooks')
      .send(createDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(createDto.title);
    expect(response.body.content).toBe(createDto.content);
  });

  it('/notebooks (GET) should include the created notebook', async () => {
    const response = await request(app.getHttpServer())
      .get('/notebooks')
      .expect(HttpStatus.OK);

    const found = response.body.find(
      (n: any) => n.title === 'Test Notebook',
    );
    expect(found).toBeDefined();
    expect(found.content).toBe('Contenido de prueba');
  });

  it('/notebooks (POST) should fail with invalid data', async () => {
    const invalidDto = {
      title: '', // título vacío
    };

    await request(app.getHttpServer())
      .post('/notebooks')
      .send(invalidDto)
      .expect(HttpStatus.BAD_REQUEST);
  });
});