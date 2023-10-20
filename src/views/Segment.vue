<template>
  <div class="container">
    <div class="timeShow">当前时间：{{ showTime2 }}</div>
    <div class="timeLine">
      <TimeLine
        ref="Timeline2"
        :initTime="defaultData.time2"
        @timeChange="timeChange2"
        :timeSegments="defaultData.timeSegments"
        @click_timeSegments="click_timeSegments"
        @click_timeline="onClickTimeLine"
        @dragTimeChange="onDragTimeChange"
      ></TimeLine>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
defineOptions({ name: 'SegmentCom' })
const defaultData = reactive({
  // 显示时间段
  time2: '2021-01-15 00:00:00',
  timeSegments: [
    {
      name: '时间段1',
      beginTime: new Date('2021-01-13 10:00:00').getTime(),
      endTime: new Date('2021-01-14 23:00:00').getTime(),
      color: '#1a94bc',
      startRatio: 0.65,
      endRatio: 0.9
    },
    {
      name: '时间段2',
      beginTime: new Date('2021-01-15 02:00:00').getTime(),
      endTime: new Date('2021-01-15 18:00:00').getTime(),
      color: '#1a94bc',
      startRatio: 0.65,
      endRatio: 0.9
    }
  ],
  timer: null
})
const showTime2 = computed(() => dayjs(defaultData.time2).format('YYYY-MM-DD HH:mm:ss'))
const Timeline2 = ref(null)

const timeChange2 = (t) => {
  defaultData.time2 = t
}
const click_timeSegments = (arr, ...args) => {
  console.log('onClickTimeSegments', arr, args)
  alert('点击了：' + arr[0].name)
}
const onClickTimeLine = (...args) => {
  console.log('onClickTimeLine', args)
}
const onDragTimeChange = (...args) => {
  console.log('onDragTimeChange', args)
}
onMounted(() => {
  defaultData.timer = setInterval(() => {
    defaultData.time2 += 1000
    Timeline2.value.setTime(defaultData.time2)
  }, 1000)
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

  .timeLine {
    height: 50px;
  }
}

.timeShow {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  user-select: none;
}
</style>
