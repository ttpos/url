import { gcm } from '@noble/ciphers/aes'
import { bytesToUtf8, concatBytes, hexToBytes, utf8ToBytes } from '@noble/ciphers/utils'
import { randomBytes } from '@noble/ciphers/webcrypto'

// import { xchacha20poly1305 } from '@noble/ciphers/chacha';
// import { managedNonce } from '@noble/ciphers/webcrypto';

// const key = randomBytes(32);
// const nonce = randomBytes(24);
// const aes = gcm(key, nonce);
// const data = utf8ToBytes('hello, noble');
// const ciphertext = aes.encrypt(data);
// const data_ = aes.decrypt(ciphertext); // utils.bytesToUtf8(data_) === data

// const key = hexToBytes('fa686bfdffd3758f6377abbc23bf3d9bdc1a0dda4a6e7f8dbdd579fa1ff6d7e1');
// const chacha = managedNonce(xchacha20poly1305)(key); // manages nonces for you
// const data = utf8ToBytes('hello, noble');
// const ciphertext = chacha.encrypt(data);
// const data_ = chacha.decrypt(ciphertext);

export function encrypt(data: string): string {
  const { encryptionKey } = useRuntimeConfig()
  const key = hexToBytes(encryptionKey)

  const nonce = randomBytes(12)
  const aes = gcm(key, nonce)
  const encrypted = aes.encrypt(utf8ToBytes(data))
  const combined = concatBytes(nonce, encrypted)
  // eslint-disable-next-line node/prefer-global/buffer
  return Buffer.from(combined).toString('hex')
}

export function decrypt(encryptedString: string): string {
  const { encryptionKey } = useRuntimeConfig()
  const key = hexToBytes(encryptionKey)

  const combined = hexToBytes(encryptedString)
  const nonce = combined.slice(0, 12)
  const encrypted = combined.slice(12)
  const aes = gcm(key, nonce)
  const decrypted = aes.decrypt(encrypted)
  return bytesToUtf8(decrypted)
}
