// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  css: ["~/assets/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxt/ui"],
  runtimeConfig: {
    unsplashAccessKeys: process.env.UNSPLASH_ACCESS_KEYS.split(",").filter(
      (key) => key
    ),
    cacheImagesSize: process.env.CACHE_IMAGES_SIZE || 100,
    cacheDir: process.env.CACHE_DIR || "cache",
    public: {
      intervalSeconds: process.env.NUXT_PUBLIC_INTERVAL_SECONDS || 120,
    },
  },
})
