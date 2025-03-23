import { DisableEndpointGuard } from './disable-endpoint-guard';
import { ExecutionContext } from '@nestjs/common';

describe('DisableEndpointGuard', () => {
  let guard: DisableEndpointGuard;

  beforeEach(() => {
    guard = new DisableEndpointGuard();
  });

  it('should always return false', () => {
    const mockContext = {} as ExecutionContext;
    expect(guard.canActivate(mockContext)).toBe(false);
  });
});
