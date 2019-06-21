// pages/my/bind-cellphone/bind-cellphone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绑定手机',
      success: function (res) {
        // success
      }
    })
    var phones=wx.getStorageSync('phoneNum')
    this.setData({
      phone: phones
    })
  },
  //获取输入的手机号
  // 手机号验证
  getPhone: function (e) {
    var phone = e.detail.value;
    let that = this
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      this.setData({
        phone: e.detail.value
      })
      // wx.showToast({
      //   title: '验证成功',
      //   icon: 'success',
      //   duration: 1000
      // })
    }
  },
  //绑定手机
  savePhone:function(){
    wx.setStorageSync('phoneNum', this.data.phone)
    wx.showToast({
      title: '绑定成功',
      icon: 'success',
      duration: 3000,
      mask: true
    })
    wx.switchTab({
      url: '../../index/index'
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