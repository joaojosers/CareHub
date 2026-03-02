import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockExecutionContext = (user: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any);

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RolesGuard(reflector);
  });

  it('should return true if no roles are required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const context = mockExecutionContext({ role: UserRole.ADMIN });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should return true if user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.ADMIN]);

    const context = mockExecutionContext({ role: UserRole.ADMIN });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should return false if user does not have required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.ADMIN]);

    const context = mockExecutionContext({ role: UserRole.FAMILIAR });

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });
});