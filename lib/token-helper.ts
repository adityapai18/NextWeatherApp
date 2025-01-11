// Utility to convert base64 to Uint8Array
const base64ToUint8Array = (base64: string) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
const uint8ArrayToBase64 = (array: Uint8Array) =>
  btoa(String.fromCharCode(...array));

export async function signToken(payload: object, secret: string, expiresIn: string) {
  const enc = new TextEncoder();

  // Calculate issued at (iat) and expiration (exp)
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + getExpirationTime(expiresIn);

  // Embed iat and exp into the payload
  const tokenPayload = { ...payload, iat, exp };

  // Convert the payload to a JSON string
  const payloadStr = JSON.stringify(tokenPayload);

  // Generate the HMAC key
  const secretKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );

  // Sign the payload
  const signature = await crypto.subtle.sign(
    'HMAC',
    secretKey,
    enc.encode(payloadStr)
  );

  // Return the token in the format: payload.signature
  return `${btoa(payloadStr)}.${uint8ArrayToBase64(new Uint8Array(signature))}`;
}

// Helper function to calculate expiration time in seconds
function getExpirationTime(expiresIn: string): number {
  const timeUnits: { [key: string]: number } = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error('Invalid expiresIn format. Use "15m", "1h", "7d", etc.');
  }

  const [, value, unit] = match;
  return parseInt(value) * timeUnits[unit];
}


export async function verifyToken(token: string, secret: string) {
  const [payloadB64, signatureB64] = token.split('.');
  const payloadStr = atob(payloadB64);
  const payload = JSON.parse(payloadStr);

  // Check if the token is expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp && currentTime > payload.exp) {
    throw new Error('Token expired');
  }

  const enc = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['verify']
  );

  const valid = await crypto.subtle.verify(
    'HMAC',
    secretKey,
    base64ToUint8Array(signatureB64),
    enc.encode(payloadStr)
  );

  if (!valid) {
    throw new Error('Invalid token');
  }

  return payload as {
    email: string;
    iat: number;
    exp: number;
};
}
