import Vue from 'vue'
import { Loading } from 'element-ui'
import _ from 'lodash'
import axios from 'axios'

let needLoadingRequestCount = 0
let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '正在解析中...',
    // background: 'rgba(0, 0, 0, 0)',
    background: 'linear-gradient(160deg, #b100ff 20%,#00b3ff 80%)'
  })
}

function endLoading() {
  loading.close()
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    _.debounce(tryCloseLoading, 100)()  //延迟100ms
  }
}

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'
axios.interceptors.request.use(
  config => {
    if (config.showLoading){
      showFullScreenLoading()
    }
    return config
  }

)
axios.interceptors.response.use(
  response => {
    if(response.config.showLoading){
      tryHideFullScreenLoading()
    }
    return response
  },
  error =>{
    tryHideFullScreenLoading()
  }
  
)

Vue.prototype.$http = axios
axios.defaults.withCredentials = true;
