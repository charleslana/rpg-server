import { LocalMiddleware } from './local-middleware';
import { ForbiddenException } from '@nestjs/common';

describe('LocalMiddleware', () => {
  let middleware: LocalMiddleware;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new LocalMiddleware();
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should call next() when IP is "::1" (IPv6 localhost)', () => {
    mockRequest = { ip: '::1', hostname: 'example.com' };
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should call next() when IP is "127.0.0.1" (IPv4 localhost)', () => {
    mockRequest = { ip: '127.0.0.1', hostname: 'example.com' };
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should call next() when hostname is "localhost"', () => {
    mockRequest = { ip: '192.168.1.1', hostname: 'localhost' };
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw ForbiddenException when request is from an external IP', () => {
    mockRequest = { ip: '192.168.1.1', hostname: 'example.com' };

    expect(() => middleware.use(mockRequest, mockResponse, mockNext)).toThrow(
      new ForbiddenException(
        'Access to /api-docs is restricted to localhost only',
      ),
    );
  });
});
