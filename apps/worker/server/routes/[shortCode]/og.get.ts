import { defineEventHandler } from 'h3'
import { eq } from 'drizzle-orm'
import { links } from '@@/database/schema'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default defineEventHandler(async (event) => {
  const { db } = event.context

  try {
    const shortCode = event.context.params?.shortCode

    if (!shortCode) {
      logger.warn('Short code not provided')
      event.node.res.statusCode = 400
      return {
        code: 400,
        message: 'Short code not provided',
      }
    }

    const urlData = await db
      ?.select()
      .from(links)
      .where(eq(links.hash, shortCode))
      .get()

    if (!urlData) {
      logger.warn('Short code not found:', shortCode)
      event.node.res.statusCode = 404
      return {
        code: 404,
        message: 'Short code not found',
      }
    }

    const { url } = urlData
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>@ttpos/a-app-worker</title>
          <meta property="og:url" content="${escapeHtml(url)}" />
          <meta property="og:type" content="website" />
        </head>
        <body>
          <script>
            window.location.href = '${escapeHtml(url)}';
          </script>
        </body>
      </html>
    `

    event.node.res.setHeader('Content-Type', 'text/html')
    event.node.res.end(html)
  }
  catch (error) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    event.node.res.statusCode = 500
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      code: 500,
      message: errorMessage,
      data: [],
    }
  }
})
