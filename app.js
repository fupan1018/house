//app.js

const config = require('./config')

App({
  data: {
    userInfo:null
  },
  onLaunch: function () {
    this.globalData={
      url:'https://iotapi.gtibee.com'
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // this.getUserInfo()
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
      
    })
    // var that=this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        //console.log(res)
        
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
               console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // this.setData({
              //   userInfo: res.userInfo
              // })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          console.log(this.globalData)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '您尚未进行授权，请点击跳转到授权页面进行授权',
            success: function (res) {
              if (res.confirm) {//这里是点击了确定以后
                //console.log('用户点击确定')
                wx.redirectTo({
                  url: '../authorization/authorization',
                })
              } else {//这里是点击了取消以后
                //console.log('用户点击取消')

              }
            }
          })
        }
      }
    })
    this.globalData.userInfo = this.data.userInfo
    // console.log(this.globalData.userInfo)
  },
  // //获取getUserInfo
  // getUserInfo: function (cb) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   } else {
  //     wx.getUserInfo({
  //       success: function (res) {
  //         console.log('用户信息', res.userInfo)
  //         that.globalData.userInfo = res.userInfo
  //         typeof cb == "function" && cb(that.globalData.userInfo)
  //       }
  //     })
  //   }
  // },
  globalData: {
    userInfo: null
  }
})

