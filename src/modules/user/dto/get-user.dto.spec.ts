import { GetUserDto } from './get-user.dto';

describe('GetUserDto', () => {
  describe('maxLife', () => {
    it('deve retornar o valor correto de maxLife baseado no nível', () => {
      const user = new GetUserDto();
      user.level = 1; // Nível 1
      expect(user.maxLife).toBe(100);

      user.level = 2;
      expect(user.maxLife).toBe(150);

      user.level = 3;
      expect(user.maxLife).toBe(200);
    });
  });

  describe('equippedTitle', () => {
    it('deve retornar o título equipado se houver', () => {
      const date = new Date();
      const user = new GetUserDto();
      user.titles = [
        {
          id: 1,
          equipped: true,
          titleId: 1,
          userId: 1,
          createdAt: date,
          updatedAt: date,
        },
        {
          id: 2,
          equipped: false,
          titleId: 2,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      expect(user.equippedTitle).toEqual({
        id: 1,
        equipped: true,
        titleId: 1,
        userId: 1,
        createdAt: date,
        updatedAt: date,
      });
    });

    it('deve retornar null se não houver título equipado', () => {
      const user = new GetUserDto();
      user.titles = [
        {
          id: 1,
          equipped: false,
          titleId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          equipped: false,
          titleId: 2,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      expect(user.equippedTitle).toBeNull();
    });

    it('deve retornar null se a lista de títulos estiver vazia', () => {
      const user = new GetUserDto();
      user.titles = [];
      expect(user.equippedTitle).toBeNull();
    });

    it('deve retornar null se os títulos não forem um array', () => {
      const user = new GetUserDto();
      user.titles = null as unknown as [];
      expect(user.equippedTitle).toBeNull();
    });
  });
});
