import * as jose from 'jose'

/**
 * Verifies a JWT token
 *
 * This function verifies the validity of a JWT token using the provided public key.
 * The public key is expected to be in a hexadecimal string format and is converted
 * into a JWK (JSON Web Key) format for verification.
 *
 * @param {string} jwtPubkey - The public key used to verify the JWT token, provided as a hexadecimal string.
 * @param {string} token - The JWT token to be verified.
 */
export async function jwtVerifyFn(jwtPubkey: string, token: string) {
  // eslint-disable-next-line node/prefer-global/buffer
  const publicKey = Buffer.from(jwtPubkey, 'hex')

  const alg = {
    cur: 'prime256v1',
    crv: 'P-256',
    jwt: 'ES256',
    kty: 'EC',
  }

  const jwk = {
    kty: alg.kty,
    crv: alg.crv,
    alg: alg.jwt,
    x: jose.base64url.encode(publicKey.subarray(1, 33)),
    y: jose.base64url.encode(publicKey.subarray(33)),
  }

  const pubKey = await jose.importJWK(jwk)

  return await jose.jwtVerify(token, pubKey)
}
