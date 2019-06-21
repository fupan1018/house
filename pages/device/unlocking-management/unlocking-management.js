// pages/unlocking-management/unlocking-management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '开锁管理',
      success: function (res) {
        // success
      }
    })
  },
  //跳转到指纹管理
  showFingerprint:function(){
    wx.navigateTo({
      url: '../unlocking-management/fingerprint-management/fingerprint-management',
    })
  },
  //跳转到卡片管理
  showCord:function(){
    wx.navigateTo({
      url: '../unlocking-management/card-management/card-management',
    })
  },
  //跳转到密码管理
  showPassword: function () {
    wx.navigateTo({
      url: '../unlocking-management/password-management/password-management',
    })
  },
  //跳转到时效密码管理
  showTimePass:function(){
    wx.navigateTo({
      url: '../unlocking-management/time-password/time-password',
    })
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