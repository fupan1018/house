// pages/device/device.js
const app = getApp()
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('')
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaName:"",
    nodeName:"",
    nodeID:"",
    vaildTime:"",
    deviceId:"",
    btMac:"",
    tenantID: "",
    tenantName: "",
    payType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      areaName: getApp().globalData.AreaName,
      nodeName: getApp().globalData.NodeName,
      nodeID: getApp().globalData.NodeID,
      vaildTime: getApp().globalData.VaildTime,
      deviceId: getApp().globalData.DeviceID,
      btMac: getApp().globalData.BTMac,
      tenantID: getApp().globalData.TenantID,
      tenantName: getApp().globalData.TenantName,
      payType: getApp().globalData.PayType,
      batteryPercent: getApp().globalData.BatteryPercent
    })
    wx.setNavigationBarTitle({
      title: '设备',
      success: function (res) {
        // success
      }
    });
  },
  /**
   * 跳转成员
   */
  viewMember:function(){
    wx.navigateTo({
      url: '../device/member/member',
    })
  },
  //添加指纹
  addFingerprint:function(){
    wx.navigateTo({
      url: '../device/add-fingerprint/member-list/member-list',
    })
  },
  //添加密码
  addPassword: function () {
    wx.navigateTo({
      url: '../device/add-password/member-list/member-list',
    })
  },
  //添加卡片
  addCord: function () {
    wx.navigateTo({
      url: '../device/add-cord/member-list/member-list',
    })
  },
  //添加时效密码
  addTemporary: function () {
    wx.navigateTo({
      url: '../device/add-temporary-password/add-temporary-password',
    })
  },
  //跳转到账单
  showBill:function(){
    wx.navigateTo({
      url: '../device/bill/bill',
    })
  },
  //跳转到消息记录
  showMessage:function(){
    wx.navigateTo({
      url: '../device/message/message',
    })
  },
  //跳转到开锁管理
  showLocking:function(){
    wx.navigateTo({
      url: '../device/unlocking-management/unlocking-management',
    })
  },
  //跳转到报修界面
  showRepair:function(){
    wx.navigateTo({
      url: '../device/repair/repair',
    })
  },
  //打开新增提示
  showRule: function () {
    this.setData({
      isRuleTrue: true
    }),
      setTimeout(function () {
        this.setData({
          isRuleTrue: false
        })
      }.bind(this), 5000)
  },
  //关闭新增提示
  hideRule: function () {
    this.setData({
      isRuleTrue: false
    })
  },
  //打开续租提示
  showRules: function () {
    this.setData({
      isRuleTrues: true
    }),
    setTimeout(function () {
      this.setData({
        isRuleTrues: false
      })
    }.bind(this), 3000)
  },
  //跳转到账单页面
  showBillPage:function(){
    wx.navigateTo({
      url: '../device/bill/bill',
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {    
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    var phoneNum = wx.getStorageSync('phoneNum');
    //加载设备信息
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetTenantInfo',
      method: 'POST', //请求方式
      data: {
        "phone": phoneNum
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        app.globalData = res.data.Data;
        //设置值
        that.setData({
          areaName: res.data.Data.AreaName,
          nodeName: res.data.Data.NodeName,
          nodeID: res.data.Data.NodeID,
          vaildTime: res.data.Data.VaildTime,
          deviceId: res.data.Data.DeviceID,
          btMac: res.data.Data.BTMac,
          tenantID: res.data.Data.TenantID,
          tenantName: res.data.Data.TenantName
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  }
})