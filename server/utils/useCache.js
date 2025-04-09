import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { writeFileSync } from "node:fs"
// 返回cache目录全路径
export const useCache_GetPath = () => {
  return join(dirname(fileURLToPath(import.meta.url)), "../../public/cache")
}

export const useCache_CacheFile = (filename, data) => {
  const filePath = join(useCache_GetPath(), filename)
  writeFileSync(filePath, data)
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
    url: "/cache/" + id + ".jpg",
  }
}
