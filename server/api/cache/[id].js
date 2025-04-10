import { join } from "node:path"
import { existsSync, createReadStream } from "node:fs"
import { sendStream } from "h3"
import { setResponseStatus } from "h3"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  console.log("cache get id", id)
  const cachePath = useCache_GetPath()
  const cacheFile = join(cachePath, `${id}`)
  if (existsSync(cacheFile)) {
    event.node.res.setHeader("Cache-Control", "max-age=31536000")
    event.node.res.setHeader("Content-Type", "image/jpeg")
    // event.node.res.setHeader("Content-Disposition", `inline; filename="${id}"`)
    return sendStream(event, createReadStream(cacheFile))
  }
  setResponseStatus(event, 404)
  return { message: "not found" }
})
