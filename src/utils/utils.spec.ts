import { calculateMaxLife } from './utils';

describe('calculateMaxLife', () => {
  it('deve retornar 100 para nível 1', () => {
    const level = 1;
    const result = calculateMaxLife(level);
    expect(result).toBe(100);
  });

  it('deve retornar 150 para nível 2', () => {
    const level = 2;
    const result = calculateMaxLife(level);
    expect(result).toBe(150);
  });

  it('deve retornar 200 para nível 3', () => {
    const level = 3;
    const result = calculateMaxLife(level);
    expect(result).toBe(200);
  });

  it('deve retornar 250 para nível 4', () => {
    const level = 4;
    const result = calculateMaxLife(level);
    expect(result).toBe(250);
  });

  it('deve retornar 1000 para nível 19', () => {
    const level = 19;
    const result = calculateMaxLife(level);
    expect(result).toBe(1000);
  });

  it('deve retornar o valor esperado para nível 100', () => {
    const level = 100;
    const expected = 100 + (100 - 1) * 50; // 100 + 4950 = 5050
    const result = calculateMaxLife(level);
    expect(result).toBe(expected);
  });
});
