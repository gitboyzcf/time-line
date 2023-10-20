<template>
  <div class="container">
    <div class="timeShow">当前时间：{{ showTime }}</div>
    <div class="timeLine">
      <TimeLine ref="TimelineRef" @timeChange="timeChange"></TimeLine>
    </div>
    <div class="btns">
      <button type="primary" @click="reRender">重新渲染</button>
      <button type="primary" @click="jump">跳转到2021-01-01零点</button>
      <select
        v-model="defaultData.zoom"
        placeholder="请选择"
        style="width: 100px; margin: 0 10px"
      >
        <option
          v-for="item in defaultData.zoomList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref,reactive, computed, onMounted, onBeforeUnmount,watch } from 'vue'
defineOptions({ name: 'BaseCom' })

// 基础用法
const defaultData = reactive({
  time: Date.now(),
  zoom: 5,
  zoomList: [
    '半小时',
    '1小时',
    '2小时',
    '6小时',
    '12小时',
    '1天',
    '3天',
    '15天',
    '30天',
    '1年',
    '10年'
  ].map((item, index) => {
    return {
      label: item,
      value: index
    }
  }),
  timer: null
})
const TimelineRef = ref(null)

const showTime = computed(() => dayjs(defaultData.time).format('YYYY-MM-DD HH:mm:ss'))

watch(() => defaultData.zoom,(value) => {
  TimelineRef.value.setZoom(value)
})
const timeChange = (t) => {
  defaultData.time = t
}
const reRender = () => {
  const initZoomIndex = 8
  TimelineRef.value.reRender()
}
const jump = () => {
  TimelineRef.value.setTime('2021-01-01 00:00:00')
}
onMounted(() => {
  defaultData.timer = setInterval(() => {
    defaultData.time += 1000
    TimelineRef.value.setTime(defaultData.time)
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

.btns {
  margin: 10px 0;
  display: flex;
  justify-content: center;
}

.timeShow {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  user-select: none;
}
</style>
