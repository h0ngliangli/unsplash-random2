export default defineEventHandler(async (event) => {
  const { unsplashAccessKey } = useRuntimeConfig()
  const response = {
    ok: true,
    message: "Success",
    data: null,
  }
  await $fetch("https://api.unsplash.com/photos/random", {
    headers: {
      Authorization: `Client-ID ${unsplashAccessKey}`,
    },
  })
    .then((result) => {
      response.data = result
    })
    .catch((err) => {
      response.ok = false
      response.message = err.message
    })
  return response
})
