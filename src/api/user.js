import request from '@/utils/request'
import Qs from 'qs'
export function login(data) {
  return request({
    url: 'login1/',
    method: 'post',
    data:Qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: 'info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'logout1/',
    method: 'post'
  })
}
