/**
 * Генерация уникального идентификатора запроса
 */
export function generateRequestId(): string {
  return crypto.randomUUID();
}

