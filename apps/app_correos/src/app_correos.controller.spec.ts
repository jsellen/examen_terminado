import { Test, TestingModule } from '@nestjs/testing';
import { AppCorreosController } from './app_correos.controller';
import { AppCorreosService } from './app_correos.service';

describe('AppCorreosController', () => {
  let appCorreosController: AppCorreosController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppCorreosController],
      providers: [AppCorreosService],
    }).compile();

    appCorreosController = app.get<AppCorreosController>(AppCorreosController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appCorreosController.getHello()).toBe('Hello World!');
    });
  });
});
