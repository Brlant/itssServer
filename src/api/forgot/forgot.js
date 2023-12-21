import request from '@/utils/request';

const forgotApi = {
  // 发送验证码
  sendCode: () => {
    return request({
      url: `/validCode/captcha`,
      method: 'get',
    });
  },
  //获取邮箱
  getEmail: (data) => {
    return request({
      url: `/validCode/getValidCode`,
      method: 'post',
      data
    });
  },
  //校验
  checkEmail: (data) => {
    return request({
      url: `/user/profile/updatePwdByForget`,
      method: 'post',
      data
    });
  },
}

export default forgotApi;
