import request from '@/utils/request';

const forgotApi = {
  // 发送验证码
  sendCode: () => {
    return request({
      url: `/system/validCode/captcha`,
      method: 'get',
    });
  },
  //获取邮箱
  getEmail: (data) => {
    return request({
      url: `/system/validCode/getValidCode`,
      method: 'post',
      data
    });
  },
  //校验
  checkEmail: (data) => {
    return request({
      url: `/system/user/profile/updatePwdByForget`,
      method: 'post',
      data
    });
  },
  //获取邮箱
  getEmailByName: (data) => {
    return request({
      url: `/system/validCode/getEmail`,
      method: 'post',
      data
    });
  },
}

export default forgotApi;
