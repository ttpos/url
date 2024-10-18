import { gcm } from '@noble/ciphers/aes'
import { bytesToUtf8, concatBytes, hexToBytes, utf8ToBytes } from '@noble/ciphers/utils'
import { randomBytes } from '@noble/ciphers/webcrypto'

export function encrypt(encryptionKey: string, data: string): string {
  const key = hexToBytes(encryptionKey)

  const nonce = randomBytes(12)
  const aes = gcm(key, nonce)
  const encrypted = aes.encrypt(utf8ToBytes(data))
  const combined = concatBytes(nonce, encrypted)
  // eslint-disable-next-line node/prefer-global/buffer
  return Buffer.from(combined).toString('hex')
}

export function decrypt(encryptionKey: string, encryptedString: string): string {
  const key = hexToBytes(encryptionKey)

  const combined = hexToBytes(encryptedString)
  const nonce = combined.slice(0, 12)
  const encrypted = combined.slice(12)
  const aes = gcm(key, nonce)
  const decrypted = aes.decrypt(encrypted)
  return bytesToUtf8(decrypted)
}
