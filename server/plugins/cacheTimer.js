export default defineNitroPlugin((nitroApp) => {
  // 定时器, 每隔600秒执行一次
  const interval = 600 * 1000
  console.log("setting up timer for useCache_Cleanup")
  setInterval(() => {
    console.log("running useCache_Cleanup")
    useCache_Cleanup()
  }, interval)
})
