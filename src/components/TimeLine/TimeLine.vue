<template>
  <div
    class="timeLineContainer"
    ref="timeLineContainer"
    :style="{
      backgroundColor: backgroundColor
    }"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @mousedown="onMousedown"
    @mouseout="onMouseout"
    @mousemove="onMousemove"
    @mouseleave="onMouseleave"
  >
    <canvas class="canvas" ref="canvas" @mousewheel.stop.prevent="onMouseweel"></canvas>
    <div
      class="windowList"
      ref="windowList"
      v-if="defaultData.showWindowList && windowList && windowList.length > 1"
      @scroll="onWindowListScroll"
    >
      <WindowListItemCom
        v-for="(item, index) in defaultData.windowListInner"
        ref="WindowListItemRef"
        :key="index"
        :index="index"
        :data="item"
        :totalMS="totalMS"
        :startTimestamp="defaultData.startTimestamp"
        :width="defaultData.width"
        :active="item.active"
        :multiSegmentActiveColor="multiSegmentActiveColor"
        @click_window_timeSegments="triggerClickWindowTimeSegments"
        @click="toggleActive(index)"
      ></WindowListItemCom>
    </div>
  </div>
</template>

<script setup>
/**
 * @Description: 时间轴组件
 * @Author zcf
 * @Date 2023-10-10 18:02
 * @E-mail boyzcf@qq.com
 */
import { ref, reactive, nextTick, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import WindowListItemCom from './WindowListItem.vue'
import {
  ONE_HOUR_STAMP,
  ZOOM,
  ZOOM_HOUR_GRID,
  ZOOM_DATE_SHOW_RULE,
  MOBILE_ZOOM_HOUR_GRID,
  MOBILE_ZOOM_DATE_SHOW_RULE
} from './constant'
defineOptions({ name: 'TimeLine' })
const props = defineProps({
  // 初始时间，中点所在的时间，默认为当天0点
  initTime: {
    type: [Number, String],
    default: ''
  },
  // 显示预览的时间范围，即中间刻度所允许的时间范围
  /*
      {
        start: '2020-12-19 18:30:00',// 允许显示的最小时间
        end: '2021-01-20 10:0:00'// 允许显示的最大时间
      }
    */
  timeRange: {
    type: Object,
    default() {
      return {}
    }
  },
  // 初始的时间分辨率
  initZoomIndex: {
    type: Number,
    default: 5 // 24小时
  },
  // 是否显示中间的竖线
  showCenterLine: {
    type: Boolean,
    default: true
  },
  // 中间竖线的样式
  centerLineStyle: {
    type: Object,
    default() {
      return {
        width: 2,
        color: '#fff'
      }
    }
  },
  // 日期时间文字颜色
  textColor: {
    type: String,
    default: 'rgba(151,158,167,1)'
  },
  // 鼠标滑过显示的时间文字颜色
  hoverTextColor: {
    type: String,
    default: 'rgb(194, 202, 215)'
  },
  // 时间线段颜色
  lineColor: {
    type: String,
    default: 'rgba(151,158,167,1)'
  },
  // 时间线段高度占时间轴高度的比例
  lineHeightRatio: {
    type: Object,
    default() {
      return {
        date: 0.3, // 0点时的日期线段高度
        time: 0.2, // 显示时间的线段高度
        none: 0.1, // 不显示时间的线段高度
        hover: 0.3 // 鼠标滑过时显示的时间段高度
      }
    }
  },
  // 鼠标滑过时是否显示实时所在的时间
  showHoverTime: {
    type: Boolean,
    default: true
  },
  // 格式化鼠标滑过时间
  hoverTimeFormat: {
    type: Function
  },
  // 要显示的时间颜色段
  /*
      {
        beginTime: new Date('2021-01-19 14:30:00').getTime(),// 起始时间戳
        endTime: new Date('2021-01-20 18:00:00').getTime(),// 结束时间戳
        color: '#FA3239',// 颜色
        startRatio: 0.65,// 高度的起始比例，即top=时间轴高度*startRatio
        endRatio: 0.9// 高度的结束比例，即bottom=时间轴高度*endRatio
      }
    */
  timeSegments: {
    type: Array,
    default: () => []
  },
  // 时间轴背景颜色
  backgroundColor: {
    type: String,
    default: '#262626'
  },
  // 多时间轴选中背景颜色
  multiSegmentActiveColor: {
    type: String
  },
  // 是否允许切换分辨率
  enableZoom: {
    type: Boolean,
    default: true
  },
  // 是否允许拖动
  enableDrag: {
    type: Boolean,
    default: true
  },
  // 多轴窗口列表，如果窗口数量大于1的话可以配置此项，会显示和窗口对应数量的时间轴，只有一个窗口的话请直接使用基本时间轴
  /*
      {
          name: '窗口1',
          timeSegments: [
              {
                  name: '窗口1的时间段1',
                  beginTime: new Date('2021-01-13 10:00:00').getTime(),
                  endTime: new Date('2021-01-14 23:00:00').getTime(),
                  color: '#FA3239',
                  startRatio: 0.1,
                  endRatio: 0.9
              },
              {
                  name: '窗口1的时间段2',
                  beginTime: new Date('2021-01-12 18:00:00').getTime(),
                  endTime: new Date('2021-01-13 00:00:00').getTime(),
                  color: '#00AEFF',
                  startRatio: 0.1,
                  endRatio: 0.9
              }
          ]
      },
    */
  windowList: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 当显示windowList时的基础时间轴高度
  baseTimeLineHeight: {
    type: Number,
    default: 50
  },
  // 初始选中的窗口时间轴
  initSelectWindowTimeLineIndex: {
    type: Number,
    default: -1
  },
  // 是否是手机端
  isMobile: {
    type: Boolean,
    default: false
  },
  // 鼠标按下和松开的距离小于该值认为是点击事件
  maxClickDistance: {
    type: Number,
    default: 3
  },
  // 绘制时间段时对计算出来的坐标进行四舍五入，可以防止相连的时间段绘制出来有间隔的问题
  roundWidthTimeSegments: {
    type: Boolean,
    default: true
  },
  // 自定义显示哪些时间
  customShowTime: {
    type: Function
  },
  // 0点处是否显示日期
  showDateAtZero: {
    type: Boolean,
    default: true
  },
  // 扩展ZOOM列表，这个数组的数据会追加到内部的ZOOM数组，对应的zoomIndex往后累加即可，内部一共有11个zoom，那么你追加了一项，对应的zoomIndex为11，因为是从零开始计数
  // 数组类型，数组的每一项为：
  /*
      {
        zoom: 26,// 时间分辨率，整个时间轴表示的时间范围，单位：小时
        zoomHourGrid: 0.5,// 时间分辨率对应的每格小时数，即时间轴上最小格代表多少小时
        mobileZoomHourGrid: 2, // 手机模式下时间分辨率对应的每格小时数，如果不用适配手机端，可以不用设置
      }
    */
  // 同时你需要传递customShowTime属性来自定义控制时间显示，否则会报错，因为内置的规则只有11个
  extendZOOM: {
    type: Array,
    default() {
      return []
    }
  },
  // 格式化时间轴显示时间
  formatTime: {
    type: Function
  }
})
const emits = defineEmits([
  'timeChange',
  'mousedown',
  'dragTimeChange',
  'mouseup',
  'click_timeSegments',
  'click_timeline',
  'change_window_time_line',
  'click_window_timeSegments'
])

const timeLineContainer = ref(null)
const canvas = ref(null)
const WindowListItemRef = ref([])

const defaultData = reactive({
  width: 0,
  height: 0,
  ctx: null,
  currentZoomIndex: 0,
  currentTime: 0,
  startTimestamp: 0,
  mousedown: false,
  mousedownX: 0,
  mousedownY: 0,
  mousedownCacheStartTimestamp: 0,
  showWindowList: false,
  windowListInner: [],
  mousemoveX: -1,
  watchTimeList: []
})

props.extendZOOM.forEach((item) => {
  ZOOM.push(item.zoom)
  ZOOM_HOUR_GRID.push(item.zoomHourGrid)
  MOBILE_ZOOM_HOUR_GRID.push(item.mobileZoomHourGrid)
})
// 整个时间轴所代表的毫秒数
const totalMS = computed(() => {
  return ZOOM[defaultData.currentZoomIndex] * ONE_HOUR_STAMP
})
// 时间范围的时间戳表示
const timeRangeTimestamp = computed(() => {
  let t = {}
  if (props.timeRange.start) {
    t.start =
      typeof props.timeRange.start === 'number'
        ? props.timeRange.start
        : new Date(props.timeRange.start).getTime()
  }
  if (props.timeRange.end) {
    t.end =
      typeof props.timeRange.end === 'number'
        ? props.timeRange.end
        : new Date(props.timeRange.end).getTime()
  }
  return t
})
const ACT_ZOOM_HOUR_GRID = computed(() => {
  return props.isMobile ? MOBILE_ZOOM_HOUR_GRID : ZOOM_HOUR_GRID
})
const ACT_ZOOM_DATE_SHOW_RULE = computed(() => {
  return props.isMobile ? MOBILE_ZOOM_DATE_SHOW_RULE : ZOOM_DATE_SHOW_RULE
})
// 年月模式
const yearMonthMode = computed(() => {
  return defaultData.currentZoomIndex === 9
})
// 年模式
const yearMode = computed(() => {
  return defaultData.currentZoomIndex === 10
})

/**
 * @Desc: 设置初始数据
 */
const setInitData = () => {
  // 内部窗口列表数据
  defaultData.windowListInner = props.windowList.map((item, index) => {
    return {
      ...item,
      active: props.initSelectWindowTimeLineIndex === index
    }
  })
  // 必须先设置currentZoomIndex
  // 初始时间分辨率
  defaultData.currentZoomIndex =
    props.initZoomIndex >= 0 && props.initZoomIndex < ZOOM.length ? props.initZoomIndex : 5
  // 初始当前时间
  defaultData.startTimestamp =
    (props.initTime
      ? typeof props.initTime === 'number'
        ? props.initTime
        : new Date(props.initTime).getTime()
      : new Date(dayjs().format('YYYY-MM-DD 00:00:00')).getTime()) -
    totalMS.value / 2
  // 根据时间范围检查并修正起始时间
  fixStartTimestamp()
}
/**
 * @Desc: 根据时间范围检查并修正起始时间
 */
const fixStartTimestamp = () => {
  let hfms = totalMS.value / 2
  let ct = defaultData.startTimestamp + hfms
  if (timeRangeTimestamp.value.start && ct < timeRangeTimestamp.value.start) {
    defaultData.startTimestamp = timeRangeTimestamp.value.start - hfms
  }
  if (timeRangeTimestamp.value.end && ct > timeRangeTimestamp.value.end) {
    defaultData.startTimestamp = timeRangeTimestamp.value.end - hfms
  }
}
/**
 * @Desc: 初始化
 */
const init = () => {
  let { width, height } = timeLineContainer.value.getBoundingClientRect()
  defaultData.width = width
  defaultData.height = props.windowList.length > 1 ? props.baseTimeLineHeight : height
  canvas.value.width = defaultData.width
  canvas.value.height = defaultData.height
  defaultData.ctx = canvas.value.getContext('2d')
  defaultData.showWindowList = true
}
/**
 * @Desc: 绘制方法
 */
const draw = () => {
  // 顺序很重要，不然层级不对
  drawTimeSegments()
  addGraduations()
  drawMiddleLine()

  defaultData.currentTime = defaultData.startTimestamp + totalMS.value / 2
  emits('timeChange', defaultData.currentTime)

  // 通知窗口时间轴渲染
  try {
    WindowListItemRef.value.forEach((item) => {
      item.draw()
    })
  } catch (error) {
    console.error(error)
  }

  // 更新观察的时间位置
  updateWatchTime()
}
/**
 * @Desc:  更新观察的时间位置
 */
const updateWatchTime = () => {
  defaultData.watchTimeList.forEach((item) => {
    // 当前不在显示范围内
    if (
      item.time < defaultData.startTimestamp ||
      item.time > defaultData.startTimestamp + totalMS.value
    ) {
      item.callback(-1, -1)
    } else {
      // 在范围内
      let x = (item.time - defaultData.startTimestamp) * (defaultData.width / totalMS.value)
      let y = 0
      let { left, top } = canvas.value.getBoundingClientRect()
      if (
        item.windowTimeLineIndex !== -1 &&
        props.windowList.length > 1 &&
        item.windowTimeLineIndex >= 0 &&
        item.windowTimeLineIndex < props.windowList.length
      ) {
        let rect = WindowListItemRef.value[item.windowTimeLineIndex].getRect()
        y = rect ? rect.top : top
      } else {
        y = top
      }
      item.callback(x + left, y)
    }
  })
}
/**
 * @Desc: 绘制中间的竖线
 */
const drawMiddleLine = () => {
  if (!props.showCenterLine) {
    return
  }
  defaultData.ctx.beginPath()
  let { width, color } = props.centerLineStyle
  let x = defaultData.width / 2
  drawLine(x, 0, x, defaultData.height, width, color)
}
/**
 * @Desc: 绘制时间刻度
 */
const addGraduations = () => {
  defaultData.ctx.beginPath()
  // 一共可以绘制的格数
  let gridNum =
    ZOOM[defaultData.currentZoomIndex] / ACT_ZOOM_HOUR_GRID.value[defaultData.currentZoomIndex]
  // 一格多少毫秒
  let msPerGrid = ACT_ZOOM_HOUR_GRID.value[defaultData.currentZoomIndex] * ONE_HOUR_STAMP
  // 每格间距，一格多少像素宽
  let pxPerGrid = defaultData.width / gridNum
  // 起始偏移距离
  let msOffset = msPerGrid - (defaultData.startTimestamp % msPerGrid)
  let pxOffset = (msOffset / msPerGrid) * pxPerGrid
  for (let i = 0; i < gridNum; i++) {
    let currentStartTimestamp = defaultData.startTimestamp + msOffset + i * msPerGrid
    let adjustMsOffset = 0
    // 分辨率以年为单位
    if (yearMode.value) {
      adjustMsOffset =
        currentStartTimestamp -
        new Date(`${dayjs(currentStartTimestamp).format('YYYY')}-01-01 00:00:00`).getTime()
    } else if (yearMonthMode.value) {
      // 分辨率以月为单位
      adjustMsOffset =
        currentStartTimestamp -
        new Date(
          `${dayjs(currentStartTimestamp).format('YYYY')}-${dayjs(currentStartTimestamp).format(
            'MM'
          )}-01 00:00:00`
        ).getTime()
    }
    let x = pxOffset + i * pxPerGrid - (adjustMsOffset / msPerGrid) * pxPerGrid
    let graduationTime = currentStartTimestamp - adjustMsOffset
    let h = 0
    let date = new Date(graduationTime)
    // 0点显示日期
    if (props.showDateAtZero && date.getHours() === 0 && date.getMinutes() === 0) {
      h =
        defaultData.height *
        (props.lineHeightRatio.date === undefined ? 0.3 : props.lineHeightRatio.date)
      defaultData.ctx.fillStyle = props.textColor
      defaultData.ctx.fillText(graduationTitle(graduationTime), x - 13, h + 15)
    } else if (checkShowTime(date)) {
      // 其余时间根据各自规则显示
      h =
        defaultData.height *
        (props.lineHeightRatio.time === undefined ? 0.2 : props.lineHeightRatio.time)
      defaultData.ctx.fillStyle = props.textColor
      defaultData.ctx.fillText(graduationTitle(graduationTime), x - 13, h + 15)
    } else {
      // 不显示时间的线段
      h =
        defaultData.height *
        (props.lineHeightRatio.none === undefined ? 0.1 : props.lineHeightRatio.none)
    }
    drawLine(x, 0, x, h, 1, props.lineColor)
  }
}

// 判断是否需要显示该时间
const checkShowTime = (date) => {
  if (props.customShowTime) {
    let res = props.customShowTime(date, defaultData.currentZoomIndex)
    if (res === true) {
      return true
    } else if (res === false) {
      return false
    }
  }
  return ACT_ZOOM_DATE_SHOW_RULE.value[defaultData.currentZoomIndex](date)
}
/**
 * @Desc: 绘制时间段
 */
const drawTimeSegments = (callback, path) => {
  const PX_PER_MS = defaultData.width / totalMS.value // px/ms，每毫秒占的像素
  props.timeSegments.forEach((item) => {
    if (item.beginTime <= defaultData.startTimestamp + totalMS.value) {
      let hasEndTime = item.endTime >= defaultData.startTimestamp
      defaultData.ctx.beginPath()
      let x = (item.beginTime - defaultData.startTimestamp) * PX_PER_MS
      let w
      if (x < 0) {
        x = 0
        w = hasEndTime ? (item.endTime - defaultData.startTimestamp) * PX_PER_MS : 1
      } else {
        w = hasEndTime ? (item.endTime - item.beginTime) * PX_PER_MS : 1
      }
      let heightStartRatio = item.startRatio === undefined ? 0.6 : item.startRatio
      let heightEndRatio = item.endRatio === undefined ? 0.9 : item.endRatio
      if (props.roundWidthTimeSegments) {
        x = Math.round(x)
        w = Math.round(w)
      }
      // 避免时间段小于1px绘制不出来
      w = Math.max(1, w)
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
// 触摸开始事件
const onTouchstart = (e) => {
  if (!props.isMobile) {
    return
  }
  e = e.touches[0]
  onPointerdown(e)
}
/**
 * @Desc: 鼠标按下事件
 */
const onMousedown = (e) => {
  if (props.isMobile) {
    return
  }
  onPointerdown(e)
}

// 按下事件
const onPointerdown = (e) => {
  let pos = getClientOffset(e)
  e.target.style.cursor = 'grabbing'
  defaultData.mousedownX = pos[0]
  defaultData.mousedownY = pos[1]
  defaultData.mousedown = true
  defaultData.mousedownCacheStartTimestamp = defaultData.startTimestamp
  emits('mousedown', e)
}
// 触摸结束事件
let onTouchend = (e) => {
  if (!props.isMobile) {
    return
  }
  e = e.touches[0]
  onPointerup(e)
}

/**
 * @Desc: 鼠标松开
 */
let onMouseup = (e) => {
  if (props.isMobile) {
    return
  }
  onPointerup(e)
}

// 松开事件
const onPointerup = (e) => {
  // 触发click事件
  e.target.style.cursor = 'pointer'
  let pos = getClientOffset(e)
  const reset = () => {
    defaultData.mousedown = false
    defaultData.mousedownX = 0
    defaultData.mousedownY = 0
    defaultData.mousedownCacheStartTimestamp = 0
  }
  if (
    Math.abs(pos[0] - defaultData.mousedownX) <= props.maxClickDistance &&
    Math.abs(pos[1] - defaultData.mousedownY) <= props.maxClickDistance
  ) {
    reset()
    onClick(...pos)
    return
  }
  if (defaultData.mousedown && props.enableDrag) {
    reset()
    emits('dragTimeChange', defaultData.currentTime)
  } else {
    reset()
  }
  emits('mouseup', e)
}
// 触摸移动事件
const onTouchmove = (e) => {
  if (!props.isMobile) {
    return
  }
  e = e.touches[0]
  onPointermove(e)
}

/**
 * @Desc: 鼠标移动事件
 */
const onMousemove = (e) => {
  if (props.isMobile) {
    return
  }
  onPointermove(e)
}

//移动事件
const onPointermove = (e) => {
  let x = getClientOffset(e)[0]
  defaultData.mousemoveX = x
  // 按下拖动
  if (defaultData.mousedown && props.enableDrag) {
    drag(x)
  } else if (props.showHoverTime) {
    // 未按下显示鼠标所在时间
    hoverShow(x)
  }
}

/**
 * @Desc: 鼠标移出事件
 */
const onMouseleave = () => {
  defaultData.mousemoveX = -1
}

/**
 * @Desc: 按下拖动
 */
const drag = (x) => {
  if (!props.enableDrag) {
    return
  }
  const PX_PER_MS = defaultData.width / totalMS.value // px/ms
  let diffX = x - defaultData.mousedownX
  // 判断是否超出限制范围
  let hfms = totalMS.value / 2
  let _newStartTimestamp = defaultData.mousedownCacheStartTimestamp - Math.round(diffX / PX_PER_MS)
  let ct = _newStartTimestamp + hfms
  if (timeRangeTimestamp.value.start && ct < timeRangeTimestamp.value.start) {
    _newStartTimestamp = timeRangeTimestamp.value.start - hfms
  }
  if (timeRangeTimestamp.value.end && ct > timeRangeTimestamp.value.end) {
    _newStartTimestamp = timeRangeTimestamp.value.end - hfms
  }
  defaultData.startTimestamp = _newStartTimestamp
  clearCanvas(defaultData.width, defaultData.height)
  draw()
}

/**
 * @Desc: 未按下显示鼠标所在时间
 */
const hoverShow = (x, noDraw) => {
  const PX_PER_MS = defaultData.width / totalMS.value // px/ms
  let time = defaultData.startTimestamp + x / PX_PER_MS
  if (!noDraw) {
    clearCanvas(defaultData.width, defaultData.height)
    draw()
  }
  let h =
    defaultData.height *
    (props.lineHeightRatio.hover === undefined ? 0.3 : props.lineHeightRatio.hover)
  drawLine(x, 0, x, h, 1, props.lineColor)
  defaultData.ctx.fillStyle = props.hoverTextColor
  let t = props.hoverTimeFormat
    ? props.hoverTimeFormat(time)
    : dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  let w = defaultData.ctx.measureText(t).width
  defaultData.ctx.fillText(t, x - w / 2, h + 20)
}

/**
 * @Desc: 鼠标移出事件
 */
const onMouseout = () => {
  clearCanvas(defaultData.width, defaultData.height)
  draw()
}
/**
 * @Desc: 鼠标滚动
 */
const onMouseweel = (event) => {
  if (!props.enableZoom) {
    return
  }
  let e = window.event || event
  let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))
  if (delta < 0) {
    if (defaultData.currentZoomIndex + 1 >= ZOOM.length - 1) {
      defaultData.currentZoomIndex = ZOOM.length - 1
    } else {
      defaultData.currentZoomIndex++
    }
  } else if (delta > 0) {
    // 放大
    if (defaultData.currentZoomIndex - 1 <= 0) {
      defaultData.currentZoomIndex = 0
    } else {
      defaultData.currentZoomIndex--
    }
  }
  clearCanvas(defaultData.width, defaultData.height)
  defaultData.startTimestamp = defaultData.currentTime - totalMS.value / 2 // 当前时间-新的时间范围的一半
  draw()
}

/**
 * @Desc: 点击事件
 */
const onClick = (x, y) => {
  const PX_PER_MS = defaultData.width / totalMS.value // px/ms
  let time = defaultData.startTimestamp + x / PX_PER_MS
  let date = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  let timeSegments = getClickTimeSegments(x, y)
  if (timeSegments && timeSegments.length > 0) {
    emits('click_timeSegments', timeSegments, time, date, x)
  } else {
    onCanvasClick(time, date, x)
  }
}

/**
 * @Desc: 检测当前是否点击了某个时间段
 */
const getClickTimeSegments = (x, y) => {
  let inItems = []
  drawTimeSegments((item) => {
    if (defaultData.ctx.isPointInPath(x, y)) {
      inItems.push(item)
    }
  }, true)
  return inItems
}

/**
 * @Desc: 获取鼠标相当于时间轴的距离
 */
const getClientOffset = (e) => {
  if (!timeLineContainer.value || !e) {
    return [0, 0]
  }
  let { left, top } = timeLineContainer.value.getBoundingClientRect()
  return [e.clientX - left, e.clientY - top]
}

/**
 * @Desc: 清除画布
 */
const clearCanvas = (w, h) => {
  defaultData.ctx.clearRect(0, 0, w, h)
}
/**
 * @Desc: 时间格式化
 */
const graduationTitle = (datetime) => {
  let time = dayjs(datetime)
  let res = ''
  if (props.formatTime) {
    res = props.formatTime(time)
  }
  if (res) {
    return res
  }
  if (yearMode.value) {
    return time.format('YYYY')
  } else if (yearMonthMode.value) {
    return time.format('YYYY-MM')
  } else if (time.hour() === 0 && time.minute() === 0 && time.millisecond() === 0) {
    return time.format('MM-DD')
  } else {
    return time.format('HH:mm')
  }
}

/**
 * @Desc: 绘制线段
 */
const drawLine = (x1, y1, x2, y2, lineWidth = 1, color = '#fff') => {
  defaultData.ctx.beginPath()
  defaultData.ctx.strokeStyle = color
  defaultData.ctx.lineWidth = lineWidth
  defaultData.ctx.moveTo(x1, y1)
  defaultData.ctx.lineTo(x2, y2)
  defaultData.ctx.stroke()
}
/**
 * @Desc: 重新渲染
 */
const reRender = () => {
  nextTick(() => {
    clearCanvas(defaultData.width, defaultData.height)
    reset()
    setInitData()
    init()
    draw()
  })
}

/**
 * @Desc: 复位
 */
const reset = () => {
  defaultData.width = 0
  defaultData.height = 0
  defaultData.ctx = null
  defaultData.currentZoomIndex = 0
  defaultData.currentTime = 0
  defaultData.startTimestamp = 0
  defaultData.mousedown = false
  defaultData.mousedownX = 0
  defaultData.mousedownCacheStartTimestamp = 0
}

/**
 * @Desc: 设置当前时间
 */
const setTime = (t) => {
  if (defaultData.mousedown) {
    return
  }
  let ts = typeof t === 'number' ? t : new Date(t).getTime()
  defaultData.startTimestamp = ts - totalMS.value / 2
  fixStartTimestamp()
  clearCanvas(defaultData.width, defaultData.height)
  draw()
  if (defaultData.mousemoveX !== -1 && !props.isMobile) {
    hoverShow(defaultData.mousemoveX, true)
  }
}

/**
 * @Desc: 转发窗口时间轴的事件
 */
const triggerClickWindowTimeSegments = (data, index, item) => {
  emits('click_window_timeSegments', data, index, item)
}

/**
 * @Desc: 设置分辨率
 */
const setZoom = (index) => {
  defaultData.currentZoomIndex = index >= 0 && index < ZOOM.length ? index : 5
  clearCanvas(defaultData.width, defaultData.height)
  defaultData.startTimestamp = defaultData.currentTime - totalMS.value / 2 // 当前时间-新的时间范围的一半
  draw()
}

/**
 * @Desc: 切换窗口时间轴的选中
 */
const toggleActive = (index) => {
  defaultData.windowListInner.forEach((item) => {
    item.active = false
  })
  defaultData.windowListInner[index].active = true
  emits('change_window_time_line', index, defaultData.windowListInner[index])
}

/**
 * @Desc: 要观察的时间点，会返回该时间点的实时位置，你可以根据该位置来设置一些你的自定义元素，位置为相对于浏览器可视窗口的位置
 */
const watchTime = (time, callback, windowTimeLineIndex) => {
  if (!time || !callback) {
    return
  }
  defaultData.watchTimeList.push({
    time: typeof time === 'number' ? time : new Date(time).getTime(),
    callback,
    windowTimeLineIndex: typeof windowTimeLineIndex === 'number' ? windowTimeLineIndex - 1 : -1
  })
}

/**
 * @Desc: 窗口时间轴滚动
 */
const onWindowListScroll = () => {
  updateWatchTime()
}

/**
 * @Desc: 尺寸重适应
 */
let onResize = () => {
  init()
  draw()
  try {
    WindowListItemRef.value.forEach((item) => {
      item.init()
    })
  } catch (error) {
    console.error(error)
  }
}

// 时间轴点击事件
const onCanvasClick = (...args) => {
  emits('click_timeline', ...args)
}

watch(() => props.timeSegments, reRender, { deep: true })

onMounted(() => {
  setInitData()
  init()
  draw()
  onMouseup = onMouseup.bind(this)
  onResize = onResize.bind(this)
  onTouchend = onTouchend.bind(this)
  if (props.isMobile) {
    window.addEventListener('touchend', onTouchend)
  } else {
    window.addEventListener('mouseup', onMouseup)
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (props.isMobile) {
    window.removeEventListener('touchend', onTouchend)
  } else {
    window.removeEventListener('mouseup', onMouseup)
  }
  window.removeEventListener('resize', onResize)
})

defineExpose({
  setTime,
  setZoom,
  watchTime,
  reRender
})
</script>

<style lang="scss" scoped>
.timeLineContainer {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  .canvas {
    flex-grow: 0;
    flex-shrink: 0;
  }

  .windowList {
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    border-top: 1px solid rgba(153, 153, 153, 1);
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
