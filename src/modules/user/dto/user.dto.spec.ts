import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserDto', () => {
  let userDto: UserDto;

  beforeEach(() => {
    userDto = new UserDto();
  });

  describe('hashPassword', () => {
    it('deve gerar um hash da senha corretamente', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await userDto.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('deve lançar erro se o hash falhar', async () => {
      const password = 'password123';

      (bcrypt.hash as jest.Mock).mockRejectedValue(
        new Error('Erro ao gerar o hash'),
      );

      try {
        await userDto.hashPassword(password);
      } catch (error) {
        expect(error.message).toBe('Erro ao gerar o hash');
      }
    });
  });

  describe('decryptPassword', () => {
    it('deve comparar corretamente a senha com o hash', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userDto.decryptPassword(
        plainPassword,
        hashedPassword,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        hashedPassword,
      );
      expect(result).toBe(true);
    });

    it('deve retornar false se a comparação falhar', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await userDto.decryptPassword(
        plainPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
    });

    it('deve lançar erro se o bcrypt falhar', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockRejectedValue(
        new Error('Erro ao comparar'),
      );

      try {
        await userDto.decryptPassword(plainPassword, hashedPassword);
      } catch (error) {
        expect(error.message).toBe('Erro ao comparar');
      }
    });
  });
});
