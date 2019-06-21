// pages/my/my.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的',
      success: function (res) {
        // success
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        var that=this
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              // that.data.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }else{
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
    
    if (this.data.userInfo) {
      this.setData({
        userInfo: this.data.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      getApp().userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          // console.log(res)
          getApp().globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },
  getUserInfo: function (e) {
    // console.log(e)
    getApp().globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 跳转到安装说明页
   */
  showInstallation:function(){
    wx.navigateTo({
      url: '../my/installation-instructions/installation-instructions',
    })
  },
  /**
   * 跳转到使用说明
   */
  showInstructions:function(){
    wx.navigateTo({
      url: '../my/instructions/instructions',
    })
  },
  /**
   * 跳转到绑定手机号
   */
  showBindPhone: function () {
    wx.navigateTo({
      url: '../my/bind-cellphone/bind-cellphone',
    })
  },
  /**
   * 跳转到关于我们
   */
  showAboutUs: function () {
    wx.navigateTo({
      url: '../my/about-us/about-us',
    })
  },
})