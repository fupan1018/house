// pages/bill/bill.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected1: true,
    selected2: false,
    flag: true,
    tenantId: "",
    array1: [],
    array2:[],
    orderTotal:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '账单管理',
      success: function (res) {
        // success
      }
    })
    //设置tenantId
    this.setData({
      tenantId: getApp().globalData.TenantID
    })
    //console.log(this.data.tenantId)
    //获取待交账单
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetUnRentBillList', //请求接口的url
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
            array1: res.data.Data
          })
        } else {

        }
      }
    });
    //获取已交账单
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetRentBillList ', //请求接口的url
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
            array2: res.data.Data
          })
        } else {

        }
      }
    });
  },
  selected1: function (e) {
    this.setData({
      selected1: true,
      selected2: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected1: false,
      selected2: true,
    })
  },
  show: function () {
    this.setData({
      flag: false,
      orderTotal: e.currentTarget.dataset.money
    })
  },
  // 当遮罩层与conts区域出现时，执行hide,flag变为true，遮罩层与conts区域再次被隐藏
  hide: function () {
    this.setData({ flag: true })
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'http://10.10.50.82:8500/API_WeixinPay/Pay',
            data: {
              code: res.code,//要去换取openid的登录凭证
              orderTotal: this.data.orderTotal
            },
            method: 'post',
            success: function (res) {
              //console.log(res.data)
              wx.requestPayment({
                timeStamp: res.data.TimeStamp,
                nonceStr: res.data.NonceStr,
                package: res.data.Package,
                signType: res.data.SignType,
                paySign: res.data.PaySign,
                success: function (res) {
                  // success
                  console.log(res);
                },
                fail: function (res) {
                  // fail
                  console.log(res);
                },
                complete: function (res) {
                  // complete
                  console.log(res);
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    }); 
   },

// //测试支付功能
//   payMoney:function(){
//     wx.login({
//       success: function (res) {
//         if (res.code) {
//           wx.request({
//             url: 'http://10.10.50.82:8500/API_WeixinPay/Pay',
//             data: {
//               code: res.code,//要去换取openid的登录凭证
//               orderTotal: 0.01
//             },
//             method: 'post',
//             success: function (res) {
//               console.log(res.data)
//               wx.requestPayment({
//                 timeStamp: res.data.TimeStamp,
//                 nonceStr: res.data.NonceStr,
//                 package: res.data.Package,
//                 signType: res.data.SignType,
//                 paySign: res.data.PaySign,
//                 success: function (res) {
//                   // success
//                   console.log(res);
//                 },
//                 fail: function (res) {
//                   // fail
//                   console.log(res);
//                 },
//                 complete: function (res) {
//                   // complete
//                   console.log(res);
//                 }
//               })
//             }
//           })
//         } else {
//           console.log('获取用户登录态失败！' + res.errMsg)
//         }
//       }
//     });    
//   },
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
    //获取待交账单
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetUnRentBillList', //请求接口的url
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
            array1: res.data.Data
          })
          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
        }
      }
    });
    //获取已交账单
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetRentBillList ', //请求接口的url
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
            array2: res.data.Data
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