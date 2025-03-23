import { IsTrimmed } from './is-trimmed';
import { validate } from 'class-validator';

class UserDto {
  @IsTrimmed({ message: 'O nickname não pode ter espaços' })
  nickname: string;
}

class UserDtoWithoutMessage {
  @IsTrimmed()
  nickname: string;
}

describe('IsTrimmed Decorator', () => {
  it('deve ser válido quando o valor não tiver espaços extras', async () => {
    const user = new UserDto();
    user.nickname = 'validNickname';

    const errors = await validate(user);
    expect(errors.length).toBe(0);
  });

  it('deve ser inválido quando o valor tiver espaços no início', async () => {
    const user = new UserDto();
    user.nickname = '  invalidNickname';

    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isTrimmed).toBe(
      'O nickname não pode ter espaços',
    );
  });

  it('deve ser inválido quando o valor tiver espaços no final', async () => {
    const user = new UserDto();
    user.nickname = 'invalidNickname  ';

    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isTrimmed).toBe(
      'O nickname não pode ter espaços',
    );
  });

  it('deve ser inválido quando o valor não for uma string', async () => {
    const user = new UserDtoWithoutMessage();
    user.nickname = 123 as unknown as string;

    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isTrimmed).toBe(
      'O valor de nickname não pode começar ou terminar com espaços.',
    );
  });
});
