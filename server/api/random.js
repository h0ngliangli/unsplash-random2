export default defineEventHandler(async (event) => {
  const response = await $fetch("https://api.unsplash.com/photos/random", {
    headers: {
      Authorization: `Client-ID ${useRuntimeConfig().unsplashAccessKey}`,
    },
  })
  const cacheResult = await useCache_CacheResponse(response)
  return cacheResult
})
