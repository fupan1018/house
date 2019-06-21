// pages/device/add-member/add-member.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tenantInfoID:"",
    userName: "",
    userPhone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加新成员',
      success: function (res) {
        // success
      }
    });
    
  },
  //获取用户输入的用户名
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  //添加
  showmembers: function () {
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/AddLeaguer', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "TenantInfoID": getApp().globalData.TenantID,
        "RealName": this.data.userName,
        "Phone": this.data.userPhone
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        // this.setData({
        //   data: res.data,
        // })
        if (res.data.ErrorCode=="0000"){
          //成功提示
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          wx.redirectTo({
            url: '../member',
          })
        }else{
          // wx.showToast({
          //   title: '添加失败',
          //   icon: 'fail',
          //   duration: 1000,
          //   mask: true
          // })
        }
        
      }
    });
    // wx.navigateTo({
    //   url: '../member',
    // })
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

  },
  
})