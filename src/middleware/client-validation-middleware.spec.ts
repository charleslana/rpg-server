import { ClientValidationMiddleware } from './client-validation-middleware';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('ClientValidationMiddleware', () => {
  let middleware: ClientValidationMiddleware;
  let mockConfigService: ConfigService;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'CLIENT_ID') return 'valid-client-id';
        if (key === 'CLIENT_SECRET') return 'valid-client-secret';
        return null;
      }),
    } as unknown as ConfigService;

    middleware = new ClientValidationMiddleware(mockConfigService);
    mockRequest = {
      header: jest.fn((key: string) => {
        if (key === 'client_id') return 'valid-client-id';
        if (key === 'client_secret') return 'valid-client-secret';
        return null;
      }),
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should call next() when credentials are valid', () => {
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw ForbiddenException when client_id is invalid', () => {
    mockRequest.header = jest.fn((key: string) =>
      key === 'client_id' ? 'invalid-client-id' : 'valid-client-secret',
    );

    expect(() => middleware.use(mockRequest, mockResponse, mockNext)).toThrow(
      new ForbiddenException('Invalid client credentials'),
    );
  });

  it('should throw ForbiddenException when client_secret is invalid', () => {
    mockRequest.header = jest.fn((key: string) =>
      key === 'client_secret' ? 'invalid-client-secret' : 'valid-client-id',
    );

    expect(() => middleware.use(mockRequest, mockResponse, mockNext)).toThrow(
      new ForbiddenException('Invalid client credentials'),
    );
  });

  it('should throw ForbiddenException when headers are missing', () => {
    mockRequest.header = jest.fn(() => null);

    expect(() => middleware.use(mockRequest, mockResponse, mockNext)).toThrow(
      new ForbiddenException('Invalid client credentials'),
    );
  });
});
