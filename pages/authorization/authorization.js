// pages/authorization/authorization.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置title
    wx.setNavigationBarTitle({
      title: '登录',
      success: function (res) {
        // success
      }
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
       
      }

    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }             
            }
          })
        }
      }
    })
  },
  getUserInfo: function (e) {
    var that=this;
    console.log(e)
    //判断是否授权
    if (e.detail.errMsg == "getUserInfo:ok" || e.detail.rawData.nickName!=""){
      app.globalData = e.detail;
      that.setData({
        userInfo: e.detail.userInfo
      })
      //console.log(that.data.userInfo)
      //跳转到首页
      wx.switchTab({
        url: '../index/index',      
      })
    }
  },
  globalData: {
    userInfo: null
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})