export const maximumInt32 = 2_147_483_647;

export const formatDate = (date: Date): string => {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function calculateMaxLife(level: number): number {
  if (level === 1) {
    return 100;
  }
  return 100 + (level - 1) * 50;
}
