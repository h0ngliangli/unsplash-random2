// 这个文件轮询 unsplashAccessKeys
const keys = useRuntimeConfig().unsplashAccessKeys
let currentIndex = 0

export default function useUnsplashKey() {
  // 每次调用都返回一个新的key
  const key = keys[currentIndex]
  console.log(key)
  currentIndex = (currentIndex + 1) % keys.length
  return key
}
