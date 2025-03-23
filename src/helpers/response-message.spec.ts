import { ResponseMessage } from './response-message';

describe('ResponseMessage', () => {
  it('should create an instance with default statusCode 200', () => {
    const message = 'Success';
    const responseMessage = new ResponseMessage(message);

    expect(responseMessage.message).toBe(message);
    expect(responseMessage.statusCode).toBe(200);
  });

  it('should create an instance with a custom statusCode', () => {
    const message = 'Success';
    const statusCode = 400;
    const responseMessage = new ResponseMessage(message, statusCode);

    expect(responseMessage.message).toBe(message);
    expect(responseMessage.statusCode).toBe(statusCode);
  });

  it('should return the correct JSON structure', () => {
    const message = 'Success';
    const statusCode = 201;
    const responseMessage = new ResponseMessage(message, statusCode);

    const json = responseMessage.toJson();

    expect(json).toEqual({
      message: message,
      statusCode: statusCode,
    });
  });

  it('should return default JSON structure when no statusCode is provided', () => {
    const message = 'Success';
    const responseMessage = new ResponseMessage(message);

    const json = responseMessage.toJson();

    expect(json).toEqual({
      message: message,
      statusCode: 200,
    });
  });
});
