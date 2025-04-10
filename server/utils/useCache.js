import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { existsSync, writeFileSync } from "node:fs"
import fs from "node:fs/promises"

// 根据cacheImagesLimit, 当前缓存的图片数量超过限制时, 删除最旧的缓存
export const useCache_Cleanup = async (limit) => {
  console.log("cleanup cache")
  const cacheImagesLimit = limit || useRuntimeConfig().cacheImagesLimit
  console.log("cacheImagesLimit", cacheImagesLimit)
  const cachePath = useCache_GetPath()
  // test
  let files = (await fs.readdir(cachePath)).filter((file) =>
    file.endsWith(".jpg")
  )
  console.log("cache files", files)
  files = await Promise.all(
    files.map(async (file) => {
      return {
        name: file,
        mtime: (await fs.stat(join(cachePath, file))).mtimeMs,
      }
    })
  )
  console.log("cache files map", files)
  files = files.sort((a, b) => b.mtime - a.mtime) // 按照文件创建时间排序 新文件排在前面
  console.log("cache files sort", files, files.length)
  files = files.slice(cacheImagesLimit) // 取出超过限制的文件
  console.log("cache files slice", files, files.length)

  console.log("cache files to remove ", files)
  files.forEach(async (file) => {
    ;[
      join(cachePath, file.name),
      join(cachePath, file.name.replace(/\.jpg$/, ".json")),
    ].forEach((file) => {
      if (!existsSync(file)) {
        console.log("file not exists", file)
        return
      }
      console.log("deleting file", file)
      try {
        fs.unlink(file)
      } catch (e) {
        console.log("delete error", e)
      }
    })
  })
}

// 返回cache目录全路径
export const useCache_GetPath = () => {
  const cacheDir = join(process.cwd(), useRuntimeConfig().cacheDir)
  console.log("cacheDir", cacheDir)
  if (!existsSync(cacheDir)) {
    fs.mkdir(cacheDir, { recursive: true })
  }
  return cacheDir
  // return join(dirname(fileURLToPath(import.meta.url)), "../../public/cache")
}

// 这个函数与unsplash api深度结合, 将response保存为[id].json文件,
// 将图片保存为[id].jpg文件
export const useCache_CacheResponse = async (response) => {
  const id = response.id
  console.log("caching id", id)
  const jsonFilePath = join(useCache_GetPath(), `${id}.json`)
  const imageFilePath = join(useCache_GetPath(), `${id}.jpg`)
  // 如果文件存在, 则直接返回
  if (existsSync(jsonFilePath) && existsSync(imageFilePath)) {
    console.log("file exists", jsonFilePath)
    const jsonFile = readFileSync(jsonFilePath, "utf-8")
    const json = JSON.parse(jsonFile)
    return {
      meta: json,
      url: "/cache/" + id + ".jpg",
    }
  }
  writeFileSync(jsonFilePath, JSON.stringify(response))
  const imgUrl = response.urls.full
  const imgResponse = await $fetch(imgUrl)
  const buffer = Buffer.from(await imgResponse.arrayBuffer())
  writeFileSync(imageFilePath, buffer)
  console.log("cached image", imageFilePath)
  console.log("cached json", jsonFilePath)
  return {
    meta: response,
    url: "/api/cache/" + id + ".jpg",
  }
}
