// pages/device/add-fingerprint-detail/add-fingerprint-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceID: "",
    btMac: "",
    name: "",
    phone: "",
    nickID: "",
    tenantID: "",
    valueID: "",
    fingerprintNames: [
      { "data_name": "左手大拇指", "state": 0 },
      { "data_name": "左手食指", "state": 0 },
      { "data_name": "左手中指", "state": 0 },
      { "data_name": "右手大拇指", "state": 0 },
      { "data_name": "右手食指", "state": 0 },
      { "data_name": "右手中指", "state": 0 }
    ],
    fingerprintName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //获取本地的数据
    var userName = wx.getStorageSync('nickName');
    var phones = wx.getStorageSync('phoneNum');
    var nickID= wx.getStorageSync('nickID');
    var valueID = wx.getStorageSync('valueID');
    this.setData({
      name: userName,
      phone: phones,
      nickID: nickID,
      valueID: valueID,
    });
   
    //设置值
    this.setData({
      deviceID: getApp().globalData.DeviceID,
      btMac: getApp().globalData.BTMac,
      tenantID: getApp().globalData.TenantID,
      nodeID: getApp().globalData.NodeID
    })
    console.log(this.data.deviceID)
    //设置title
    wx.setNavigationBarTitle({
      title: '添加指纹',
      success: function (res) {
        // success
      }
    });
  },
  //选择问题的选中方法
  selection: function (e) {
    console.log(e)
    this.setData({
      fingerprintName: e.currentTarget.dataset.text
    })
    //console.log(this.data.fingerprintName)
  },
  //保存指纹名称
  addSave: function () {
    var nick = this.data.name + this.data.fingerprintName
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/AddPassWordInfo', //请求接口的url
      method: 'POST', //请求方式
      data: { "PasswordType": 3, "Fingerprint": nick, "PasswordContent": "", "IdentityCard": "成员", "Name": this.data.name, "Phone": this.data.phone, "leaguerInfoID": this.data.nickID, "CreateUser": this.data.tenantID, "ValueID": this.data.valueID, "NodeID": this.data.nodeID },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        if (res.data.ErrorCode == "0000") {
          //成功提示
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          wx.redirectTo({
            url: '../member-list/member-list',
          })
        }
      },
      fail: res => {

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

  }
})