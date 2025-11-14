import * as jose from 'jose';

export interface JWTPayload {
  userId?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Верификация JWT токена
 */
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jose.jwtVerify(token, secretKey);
  return payload as JWTPayload;
}

/**
 * Подпись JWT токена
 */
export async function signJWT(
  payload: JWTPayload,
  secret: string,
  expiresIn: string = '2h'
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

