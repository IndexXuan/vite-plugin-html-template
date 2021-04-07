import { promises as fs } from 'fs'

/** read original template content */
async function readHtmlTemplate(templatePath: string) {
  return await fs.readFile(templatePath, { encoding: 'utf8' })
}

/** patch original content with vite entry esmodule script */
export async function getHtmlTemplate(templatePath: string, entryJsPath: string) {
  const htmlContent = await readHtmlTemplate(templatePath)
  return htmlContent.replace(
    '<div id="app"></div>',
    `<div id="app"></div>\n    <script type="module" src="${entryJsPath}"></script>`,
  )
}
