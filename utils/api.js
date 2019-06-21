// 这是域名
export const API_URI = 'https://iotapi.gtibee.com'

function fetchApi(type, params, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URI}/${type}`,
      data: params,
      methods: method || 'GET',
      header: {
        'content-type': 'json'
      },
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {

  // 得到openId
  getOpenId: function (type, encryptedData, iv, js_code, method) {
    return fetchApi(type, {
      "encryptedData": encryptedData,
      "iv": iv,
      "js_code": js_code
    }, method)
      .then(res => res.data)
  },
}