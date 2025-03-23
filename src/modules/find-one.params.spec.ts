import { FindOneParams } from './find-one.params';
import { validate } from 'class-validator';
import { maximumInt32 } from '@/utils/utils';
import { plainToInstance } from 'class-transformer';

describe('FindOneParams', () => {
  it('should pass validation with a valid ID', async () => {
    const params = new FindOneParams();
    params.id = 100;

    const errors = await validate(params);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when ID is below the minimum (1)', async () => {
    const params = new FindOneParams();
    params.id = 0;

    const errors = await validate(params);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when ID exceeds maximumInt32', async () => {
    const params = new FindOneParams();
    params.id = maximumInt32 + 1;

    const errors = await validate(params);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when ID is not an integer', async () => {
    const params = new FindOneParams();
    params.id = 'string' as unknown as number;

    const errors = await validate(params);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should transform a string number into an integer', () => {
    const params = plainToInstance(FindOneParams, { id: '42' });

    expect(params.id).toBe(42);
  });

  it('should set NaN when given an invalid string', () => {
    const params = plainToInstance(FindOneParams, { id: 'invalid' });

    expect(params.id).toBeNaN();
  });
});
