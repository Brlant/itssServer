import Cookies from 'js-cookie'
import user from '../store/modules/user'

const TokenKey = 'Admin-Token'

const ExpiresInKey = 'Admin-Expires-In'


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserKey() {
  return Cookies.get('User')
}

export function setUserKey(user) {
  return Cookies.set('User', JSON.stringify(user))
}

export function removeUserKey() {
  return Cookies.remove('User')
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}
