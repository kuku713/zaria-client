import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import store from '@/store'
import {VueAxios} from './axios'
import notification from 'ant-design-vue/es/notification'
import {ACCESS_TOKEN} from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // api base_url
  timeout: 6000, // 请求超时时间
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
});

service.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const err = (error) => {
  if (error.response) {
    const data = error.response.data;
    const token = Vue.ls.get(ACCESS_TOKEN);
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      });
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN);
  if (token) {
    config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err);

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err);

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
};

export {
  installer as VueAxios,
  service as axios
}
