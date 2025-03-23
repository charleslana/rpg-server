import { plainToClass } from 'class-transformer';
import { GetUserTitleDto, GetUserTitleExposeDto } from './get-user-title.dto';
import { GetTitleDto } from '@/modules/title/dto/get-title.dto';

describe('GetUserTitleDto', () => {
  // TODO expor title
  it('deve transformar corretamente o título com o tipo UserTitle', () => {
    const mockData = {
      title: {
        id: 1,
        name: 'Title 1',
      },
    };

    const userTitleDto = plainToClass(GetUserTitleDto, mockData);

    expect(userTitleDto.title).toBeInstanceOf(GetTitleDto);
    expect(userTitleDto.title.id).toBe(1);
  });

  it('deve lançar um erro se a transformação falhar por dados incorretos', () => {
    const invalidData = {
      title: 'Invalid title',
    };

    const userTitleDto = plainToClass(GetUserTitleDto, invalidData);

    expect(userTitleDto.title).not.toBeInstanceOf(GetTitleDto);
    expect(userTitleDto.title).toBe('Invalid title');
  });

  // TODO expor title
  it('deve transformar corretamente o título e o atributo equipped no GetUserTitleExposeDto', () => {
    const mockData = {
      equipped: false,
      title: {
        id: 2,
        name: 'Title 2',
      },
    };

    const userTitleExposeDto = plainToClass(GetUserTitleExposeDto, mockData);

    expect(userTitleExposeDto.equipped).toBe(false);
    expect(userTitleExposeDto.title).toBeInstanceOf(GetTitleDto);
    expect(userTitleExposeDto.title.id).toBe(2);
  });
});
