import TimeLineCom from './TimeLine.vue'

const TimeLine = {
  install(app, options) {
    const comName = options?.comName ? options?.comName : 'TimeLine'
    app.component(comName, TimeLineCom)
  }
}
export { TimeLineCom }
export default TimeLine
