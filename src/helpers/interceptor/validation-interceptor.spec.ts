import { ValidationInterceptor } from './validation-interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('ValidationInterceptor', () => {
  let interceptor: ValidationInterceptor;
  let context: ExecutionContext;
  let next: jest.Mocked<CallHandler>;

  beforeEach(() => {
    interceptor = new ValidationInterceptor();

    next = {
      handle: jest.fn(),
    };

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as unknown as ExecutionContext;
  });

  it('should log validation failure and rethrow error', (done) => {
    const errorMessage = 'Validation failed';
    const error = { response: { message: errorMessage } };

    next.handle.mockReturnValue(throwError(() => error));

    const handleSpy = jest.spyOn(next, 'handle');

    interceptor.intercept(context, next).subscribe({
      error: (err) => {
        expect(err).toBe(error);

        expect(handleSpy).toHaveBeenCalled();

        done();
      },
    });
  });

  it('should handle error without response.message and log it', (done) => {
    const errorMessage = 'General error';
    const error = { message: errorMessage };

    next.handle.mockReturnValue(throwError(() => error));

    const handleSpy = jest.spyOn(next, 'handle');

    interceptor.intercept(context, next).subscribe({
      error: (err) => {
        expect(err).toBe(error);

        expect(handleSpy).toHaveBeenCalled();

        done();
      },
    });
  });

  it('should return data if no error occurs', (done) => {
    const responseData = { success: true };

    next.handle.mockReturnValue(of(responseData));

    interceptor.intercept(context, next).subscribe({
      next: (data) => {
        expect(data).toBe(responseData);
        done();
      },
    });
  });
});
