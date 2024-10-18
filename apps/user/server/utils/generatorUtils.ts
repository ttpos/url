import { customAlphabet } from 'nanoid'

// Define the character set for all characters, including uppercase, lowercase letters, and digits
const ALL_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const UPPERCASE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const generateRandomUppercaseString = (length: number) => customAlphabet(UPPERCASE_CHARACTERS, length)()

export const generateCode = (length: number) => customAlphabet(ALL_CHARACTERS, length)()
