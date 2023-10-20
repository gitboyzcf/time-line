<template>
  <div class="windowListItem" :class="{ active: active }" ref="windowListItem" @click="onClick">
    <span class="order">{{ index + 1 }}</span>
    <canvas class="windowListItemCanvas" ref="canvas"></canvas>
  </div>
</template>

<script setup>
/**
 * @Description: 多轴项目
 * @Author zcf
 * @Date 2023-10-13 09:55
 * @E-mail boyzcf@qq.com
 */
import { ref, reactive, onMounted, nextTick } from 'vue'
defineOptions({ name: 'WindowListItem' })
const props = defineProps({
  index: {
    type: Number
  },
  data: {
    type: Object,
    default() {
      return {}
    }
  },
  totalMS: {
    type: Number
  },
  startTimestamp: {
    type: Number
  },
  width: {
    type: Number
  },
  active: {
    type: Boolean,
    default: false
  },
  multiSegmentActiveColor:{
    type: String,
    default: '#333'
  }
  
})
const emits = defineEmits(['click', 'click_window_timeSegments'])
const windowListItem = ref(null)
const canvas = ref(null)
const defaultData = reactive({
  height: 0,
  ctx: null
})

/**
 * @Desc: 初始化
 */
const init = () => {
  let { height } = windowListItem.value.getBoundingClientRect()
  defaultData.height = height - 1
  canvas.value.width = props.width
  canvas.value.height =  defaultData.height
  defaultData.ctx = canvas.value.getContext('2d')
}

/**
 * @Desc: 绘制时间段
 */
const drawTimeSegments = (callback, path) => {
  if (!props.data.timeSegments || props.data.timeSegments.length <= 0) {
    return
  }
  const PX_PER_MS = props.width /  props.totalMS // px/ms，每毫秒占的像素
  props.data.timeSegments.forEach((item) => {
    if (
      item.beginTime <=  props.startTimestamp +  props.totalMS &&
      item.endTime >=  props.startTimestamp
    ) {
      defaultData.ctx.beginPath()
      let x = (item.beginTime -  props.startTimestamp) * PX_PER_MS
      let w
      if (x < 0) {
        x = 0
        w = (item.endTime -  props.startTimestamp) * PX_PER_MS
      } else {
        w = (item.endTime - item.beginTime) * PX_PER_MS
      }
      let heightStartRatio = item.startRatio === undefined ? 0.6 : item.startRatio
      let heightEndRatio = item.endRatio === undefined ? 0.9 : item.endRatio
      if (path) {
        defaultData.ctx.rect(
          x,
           defaultData.height * heightStartRatio,
          w,
           defaultData.height * (heightEndRatio - heightStartRatio)
        )
      } else {
        defaultData.ctx.fillStyle = item.color
        defaultData.ctx.fillRect(
          x,
           defaultData.height * heightStartRatio,
          w,
           defaultData.height * (heightEndRatio - heightStartRatio)
        )
      }
      callback && callback(item)
    }
  })
}
/**
 * @Desc: 清除画布
 */
const clearCanvas = () => {
  defaultData.ctx.clearRect(0, 0, props.width,  defaultData.height)
}

/**
 * @Desc: 绘制
 */
const draw = () => {
  nextTick(() => {
    clearCanvas()
    drawTimeSegments()
  })
}

/**
 * @Desc: 点击事件
 */
const onClick = (e) => {
  emits('click', e)
  let { left, top } = windowListItem.value.getBoundingClientRect()
  let x = e.clientX - left
  let y = e.clientY - top
  let timeSegments = getClickTimeSegments(x, y)
  if (timeSegments.length > 0) {
    emits('click_window_timeSegments', timeSegments, props.index, props.data)
  }
}
/**
 * @Desc: 检测当前是否点击了某个时间段
 */
const getClickTimeSegments = (x, y) => {
  if (!props.data.timeSegments || props.data.timeSegments.length <= 0) {
    return []
  }
  let inItems = []
  drawTimeSegments((item) => {
    if (defaultData.ctx.isPointInPath(x, y)) {
      inItems.push(item)
    }
  }, true)
  return inItems
}
/**
 * @Desc: 获取位置信息
 */
const getRect = () => {
  return windowListItem.value ? windowListItem.value.getBoundingClientRect() : null
}
onMounted(() => {
  init()
  drawTimeSegments()
})

defineExpose({
  draw,
  getRect
})
</script>

<style lang="scss" scoped>
.windowListItem {
  width: 100%;
  height: 30px;
  position: relative;
  border-bottom: 1px solid rgba(153, 153, 153, 1);
  user-select: none;

  &.active {
    background-color: v-bind(multiSegment);
  }

  .order {
    position: absolute;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-right: 1px solid rgba(153, 153, 153, 1);
  }
}
</style>
