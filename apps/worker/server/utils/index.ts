import { customAlphabet } from 'nanoid'

// Define the character set for the shortcode, including uppercase, lowercase letters, and digits
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// Create a custom nanoid function with the specified character set and length
const nanoid = customAlphabet(CHARACTERS, 6)

/**
 * Generate a short code for a URL
 *
 * e.g., "aB3xZ1k9"
 */
export const generateShortCode = () => nanoid()
