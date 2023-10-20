<template>
  <div class="container">
    <div class="timeShow">当前时间：{{ showTime4 }}</div>
    <div class="timeLine4">
      <TimeLine
        ref="Timeline4Ref"
        :initTime="defaultData.time4"
        :windowList="defaultData.windowList4"
        @timeChange="timeChange4"
      ></TimeLine>
    </div>
    <i class="icon el-icon-s-flag" ref="flagIcon" style="color: #e72528"></i>
    <i class="icon el-icon-bicycle" ref="carIcon" style="color: #2196f3"></i>
  </div>
</template>

<script setup>
// 显示自定义元素
import dayjs from 'dayjs'
import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'CustomCom' })
const defaultData = reactive({
  time4: '2021-01-02 00:00:00',
  windowList4: [
    {
      name: '窗口1'
    },
    {
      name: '窗口2'
    },
    {
      name: '窗口3'
    },
    {
      name: '窗口4'
    },
    {
      name: '窗口5'
    },
    {
      name: '窗口6'
    }
  ],
  timer: null
})
const showTime4 = computed(() => dayjs(defaultData.time4).format('YYYY-MM-DD HH:mm:ss'))
const Timeline4Ref = ref(null)
const flagIcon = ref(null)
const carIcon = ref(null)

const timeChange4 = (t) => {
  defaultData.time4 = t
}
onMounted(() => {
  defaultData.timer = setInterval(() => {
    defaultData.time4 += 1000
    Timeline4Ref.value.setTime(defaultData.time4)
  }, 1000)
  window.addEventListener('scroll', () => {
    Timeline4Ref.value.updateWatchTime()
  })
  Timeline4Ref.value.watchTime('2021-01-01 23:30:00', (x, y) => {
    if (x === -1 || y === -1) {
      flagIcon.value.style.display = 'none'
    } else {
      flagIcon.value.style.display = 'block'
      flagIcon.value.style.left = x + 'px'
      flagIcon.value.style.top = y + 24 + 'px'
    }
  })
  Timeline4Ref.value.watchTime(
    '2021-01-02 02:30:00',
    (x, y) => {
      if (x === -1 || y === -1) {
        carIcon.value.style.display = 'none'
      } else {
        carIcon.value.style.display = 'block'
        carIcon.value.style.left = x + 'px'
        carIcon.value.style.top = y + 'px'
      }
    },
    2
  )
})

onBeforeUnmount(() => {
  clearTimeout(defaultData.timer)
})
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  position: relative;
  justify-content: center;
  flex-direction: column;

  .timeLine4 {
    height: 200px;
  }
}

.timeShow {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  user-select: none;
}

.icon {
  position: fixed;
  font-size: 30px;
}
</style>
