import { PageDto } from './page.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe('PageDto', () => {
  it('should transform string values into numbers and pass validation', async () => {
    const plainObject = { page: '2', pageSize: '10' };
    const pageDto = plainToClass(PageDto, plainObject);

    const errors = await validate(pageDto);

    expect(errors.length).toBe(0);
    expect(pageDto.page).toBe(2);
    expect(pageDto.pageSize).toBe(10);
  });

  it('should fail validation when page is less than 1', async () => {
    const plainObject = { page: '0', pageSize: '10' };
    const pageDto = plainToClass(PageDto, plainObject);

    const errors = await validate(pageDto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when pageSize is greater than 20', async () => {
    const plainObject = { page: '1', pageSize: '21' };
    const pageDto = plainToClass(PageDto, plainObject);

    const errors = await validate(pageDto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when pageSize is less than 1', async () => {
    const plainObject = { page: '1', pageSize: '0' };
    const pageDto = plainToClass(PageDto, plainObject);

    const errors = await validate(pageDto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should return correct error messages for invalid page and pageSize', async () => {
    const plainObject = { page: '0', pageSize: '21' };
    const pageDto = plainToClass(PageDto, plainObject);

    const errors = await validate(pageDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
    expect(errors[1].constraints).toHaveProperty('max');
  });
});
