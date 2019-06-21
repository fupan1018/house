//index.js
//获取应用实例
const api = require('../../utils/api');
const app = getApp()

Page({
  data: {
    motto: '欢迎进入MM小程序！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    areaName: "",
    nodeName: "",
    nodeID: "",
    vaildTime: "",
    deviceId: "",
    btMac: "",
    tenantID:"",
    tenantName:"",
    phoneNum:"",
    loadingHidden: false  // loading
  },
  //事件处理函数 
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // this.setData({
    //   areaName: getApp().globalData.AreaName
    // })
    //获取本地存储的手机号
    var phoneNum = wx.getStorageSync('phoneNum');
    this.setData({
      phoneNum: phoneNum
    })
    //判断是否授权
    //判断是否绑定手机号
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      if(this.data.userInfo!=null){
        if (phoneNum == "") {
          wx.showModal({
            title: '温馨提示',
            content: '您尚未绑定手机号，请点击跳转到我的页面进行绑定',
            success: function (res) {
              if (res.confirm) {//这里是点击了确定以后
                //console.log('用户点击确定')
                wx.navigateTo({
                  url: '../my/bind-cellphone/bind-cellphone',
                })
              } else {
                wx.showModal({
                  title: '温馨提示',
                  content: '您尚未绑定手机号，暂时不能查看门锁信息',
                  success: function (res) {
                    if (res.confirm) {//这里是点击了确定以后
                      //console.log('用户点击确定')

                    } else {
                      wx.navigateTo({
                        url: '../my/bind-cellphone/bind-cellphone',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
      
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //加载设备信息
    this.getDeviceMesg();
    //设置title
    wx.setNavigationBarTitle({
      title: '首页',
      success: function (res) {
        // success
      }
    })
  },
  onShow() { //返回显示页面状态函数
    //错误处理
    this.onLoad()//再次加载，实现返回上一页页面刷新
    //正确方法
    //只执行获取地址的方法，来进行局部刷新
  },
  //加载设备
  getDeviceMesg:function(){
    var that=this;
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetTenantInfo',
      method: 'POST', //请求方式
      data: {
        "phone": this.data.phoneNum
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        console.log(res)
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
        if (res.data.ErrorCode == '0000') {
          app.globalData = res.data.Data;
          that.setData({
            areaName: res.data.Data.AreaName,
            nodeName: res.data.Data.NodeName,
            nodeID: res.data.Data.NodeID,
            vaildTime: res.data.Data.VaildTime,
            deviceId: res.data.Data.DeviceID,
            btMac: res.data.Data.BTMac,
            tenantID: res.data.Data.TenantID,
            tenantName: res.data.Data.TenantName,
            effectDate: res.data.Data.VaildTime,
            batteryPercent: res.data.Data.BatteryPercent
          })
        } else {
          wx.showToast({
            title: '手机号绑定错误',
            icon: 'success',
            duration: 3000
          })
        }

      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '数据请求错误',
          icon: 'success',
          duration: 3000
        })

      },
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //获取本地存储的手机号
    var phoneNum = wx.getStorageSync('phoneNum');
    //加载设备信息
    this.getDeviceMesg();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  
  viewLock:function(){
    wx.navigateTo({
      url: '../lock/lock',
    })
  }
})
