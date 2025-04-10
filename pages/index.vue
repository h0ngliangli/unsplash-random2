<script setup>
const {intervalSeconds} = useRuntimeConfig().public
const refModel = ref({
  countDown: intervalSeconds,
  description: "",
  url: "/default.jpg",
  username: "",
  userprofileUrl: "",
  likes: 0,
  views: 0,
  downloads: 0,
  errorCode: 0,
  errorMessage: "",
})

// 读取随机图片
const reload = async () => {
  const counter = setInterval(() => {
    refModel.value.countDown--
    if (refModel.value.countDown <= 0) {
      clearInterval(counter)
      refModel.value.countDown = intervalSeconds
      reload()
    }
  }, 1000)
  const response = await $fetch('/api/random')
  refModel.value.description = response.meta.description || response.meta.alt_description || ""
  refModel.value.url = response.url
  refModel.value.username = response.meta.user.name
  refModel.value.userprofileUrl = response.meta.user.profile_image.medium
  refModel.value.likes = response.meta.likes
  refModel.value.views = response.meta.views
  // if (!response.ok) {
  //   refModel.value.errorCode = response.status
  //   refModel.value.errorMessage = response.statusText
  //   // console.error("Error fetching data:", response.statusText)
  //   return
  // }
  // refModel.value.errorCode = 0
  // refModel.value.errorMessage = ""
  // const data = await response.json()
  // // console.log(data)
  // refModel.value.description = data.description || data.alt_description || ""
  // refModel.value.url = data.urls.full
  // refModel.value.username = data.user.name
  // refModel.value.userprofileUrl = data.user.profile_image.medium
  // refModel.value.likes = data.likes
  // refModel.value.views = data.views
  // refModel.value.downloads = data.downloads
  // refModel.value.countDown = config.intervalSeconds
}

// 全屏切换
const toggleFullscreen = () => {
  const elem = document.documentElement
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message}`
      )
    })
  } else {
    document.exitFullscreen()
  }
}

onMounted(async () => {
  reload()
})
</script>

<template>
  <div>
    <div
      class="wallpaper"
      :style="{ backgroundImage: 'url(' + refModel.url + ')' }"
    ></div>
    <div class="title">
      {{ refModel.description }}
    </div>
    <!-- <img :src="refModel.url" class="wallpaper" /> -->
    <div class="desc">
      <div v-if="refModel.errorCode === 0">
        <div class="flex flex-row align-items-center gap-1">
          <img :src="refModel.userprofileUrl" width="24px" />
          <p>
            {{ refModel.username }}
          </p>
        </div>
        <div class="flex flex-row align-items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
              stroke-width="0.5"
              stroke="currentColor"
            />
          </svg>
          <p>{{ refModel.likes }}</p>
        </div>
      </div>
      <div v-else>
        <p>Error: {{ refModel.errorCode }} {{ refModel.errorMessage }}</p>
      </div>
      <p>Next in {{ refModel.countDown }}</p>
    </div>
    <div class="fullscreen" @click="toggleFullscreen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M3 21v-5h2v3h3v2zm13 0v-2h3v-3h2v5zM3 8V3h5v2H5v3zm16 0V5h-3V3h5v5z"
          stroke-width="0.5"
          stroke="currentColor"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin abs-transparent {
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  color: white;
  font-family: "Courier New";
  font-size: 20px;
  margin: 5px;
  position: absolute;
  padding: 10px;
}

.wallpaper {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  height: 100vh;
  width: 100vw;
}

.title {
  /* 居中显示 */
  @include abs-transparent;
  left: 50%;
  max-width: 50%;
  text-align: center;
  top: 20%;
  transform: translateX(-50%);
}

.desc {
  @include abs-transparent;
  bottom: 40px;
  right: 20px;
  text-align: left;
  font-size: 14px;
}
.fullscreen {
  @include abs-transparent;
  left: 0px;
  bottom: 40px;
}
</style>
