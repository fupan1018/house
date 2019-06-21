// pages/device/add-cord/member-list/member-list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tenantId: "",
    array: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加卡片',
      success: function (res) {
        // success
      }
    });
    this.setData({
      tenantId: getApp().globalData.TenantID
    })
    //获取成员列表
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetLeaguerList', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "tenantId": getApp().globalData.TenantID
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        if (res.data.ErrorCode == "0000") {
          this.setData({
            array: res.data.Data
          })
          console.log(this.data.array)
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
  addCordPage: function (e) {
    let that = this
    var dataID = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../add-cord?datas=' + JSON.stringify(that.data.array) + '&dataID=' + dataID
    })
  },
})