// pages/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tenantId: "",
    array:[],    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息记录',
      success: function (res) {
        // success
      }
    })
    this.setData({
      tenantId: getApp().globalData.TenantID
    })
    console.log(this.data.tenantId)
    //获取消息列表
    this.getMessageList();
  },
  //获取消息列表
  getMessageList:function(){
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetRentMessageList', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "tenantId": this.data.tenantId
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        //var array=[];
        if (res.data.ErrorCode == "0000") {
          this.setData({
            array: res.data.Data
          })
          // for(var i=0;i<array.length;i++){
          //   if (array[i].MessageType==0){

          //   }
          // }
        } else {

        }
      }
    });
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    //获取消息
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetRentMessageList', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "tenantId": that.data.tenantId
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        //var array=[];
        if (res.data.ErrorCode == "0000") {
          that.setData({
            array: res.data.Data
          })
          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
        }
      }
    });
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