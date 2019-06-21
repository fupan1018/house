// pages/device/add-cord/add-cord-detail/add-cord-detail.js
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
    cordID: "",
    cordName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //获取本地的数据
    var userName = wx.getStorageSync('nickName');
    var phones = wx.getStorageSync('phoneNum');
    var nickID = wx.getStorageSync('nickID');
    var cordId = wx.getStorageSync('cordId');
    this.setData({
      name: userName,
      phone: phones,
      nickID: nickID,
      cordID: cordId,
    });
    //设置值
    this.setData({
      deviceID: getApp().globalData.DeviceID,
      btMac: getApp().globalData.BTMac,
      tenantID: getApp().globalData.TenantID,
      nodeID: getApp().globalData.NodeID
    })
    //设置title
    wx.setNavigationBarTitle({
      title: '添加卡片',
      success: function (res) {
        // success
      }
    });
  },
  //获取用户输入的用户名
  cordNameInput: function (e) {
    this.setData({
      cordName: e.detail.value
    })
  },
  //保存卡片名称
  addSave:function(){
    var nick = this.data.name + this.data.cordName
    //console.log(nick)
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/AddPassWordInfo', //请求接口的url
      method: 'POST', //请求方式
      data: { "PasswordType": 4, "Fingerprint": nick, "PasswordContent": "", "IdentityCard": "成员", "Name": this.data.name, "Phone": this.data.phone, "leaguerInfoID": this.data.nickID, "CreateUser": this.data.tenantID, "ValueID": this.data.cordID, "NodeID": this.data.nodeID},
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
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