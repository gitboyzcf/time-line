<template>
  <div id="app">
    <div class="switch-com">
      <div v-for="(item, i) in defaultData.list" :key="i">
        <input type="radio" :id="'comp'+i" name="comp" :value="item.value" v-model="defaultData.activeComp" />
        <label :for="'comp'+i">{{ item.name }}</label>
      </div>
    </div>
    <div class="box">
      <component :is="defaultData.activeComp"></component>
    </div>
    <div>
      <a href="https://github.com/wanglin2/VideoTimeLine/tree/main/demo/src/components">demo源码</a>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowReactive, watch } from 'vue'
import Base from './views/Base.vue'
import Custom from './views/Custom.vue'
import MultiSegment from './views/MultiSegment.vue'
import Segment from './views/Segment.vue'
import Year from './views/Year.vue'
import YearMonth from './views/YearMonth.vue'
import CustomZoom from './views/CustomZoom.vue'

const defaultData = shallowReactive({
  activeComp: Base,
  list: [
    {
      name: '基础用法',
      value: Base
    },
    {
      name: '显示时间段',
      value: Segment
    },
    {
      name: '多个时间轴',
      value: MultiSegment
    },
    {
      name: '显示自定义元素',
      value: Custom
    },
    {
      name: '显示到年',
      value: Year
    },
    {
      name: '显示到年月',
      value: YearMonth
    },
    {
      name: '自定义时间分辨率',
      value: CustomZoom
    }
  ]
})
defineOptions({ name: 'App' })

watch(
  () => defaultData.activeComp,
  (comp) => {
    console.log(comp);
    // defaultData.activeComp = comp
  }
)
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.box {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}
#app{
  padding-top: 50px;
  .switch-com{
    display: flex;
    &>div{
      margin: 0 15px;
    }
  }
}
</style>
