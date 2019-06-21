// pages/device/member/member-details/member-details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected1: true,
    selected2: false,
    selected3: false,
    name: "",
    phone: "",
    memberID: "",
    tenantID: "",
    arrayPassword:[],
    arrayFingerprint:[],
    arrayCord:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    //获取用户名和手机号
    var that = this
    var datas = JSON.parse(options.datas)
    var dataId = options.dataID
    //获取的id值存入data中
    that.setData({
      memberID: dataId
    })
    //遍历数组
    for (var i = 0; i < datas.length; i++) {
      //判断数组中的id是否和之前点击的id值相等
      if (datas[i].ID == dataId) {
        //设置name和phone
        that.setData({
          name: datas[i].RealName,
          phone: datas[i].Phone
        })
      }
    }
    wx.setNavigationBarTitle({
      title: '成员详情',
      success: function (res) {
        // success
      }
    })
    //获取密码列表
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetPassWordInfo ', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "LeaguerInfoID": this.data.memberID
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        var arr1=[];
        var arr2 = [];
        var arr3 = [];
        if (res.data.ErrorCode == "0000") { 
          for(var i=0;i<res.data.Data.length;i++){
            console.log(res.data.Data[i])
            for (var type in res.data.Data[i]) {
              if (type == 1) {
                arr1 = arr1.concat(res.data.Data[i][type])
              }
              if (type == 3) {
                arr2 = arr2.concat(res.data.Data[i][type])
              }
              if (type == 4) {
                arr3 = arr3.concat(res.data.Data[i][type])
              }
            }
          }
          //设置值
          this.setData({
            arrayPassword: arr1,
            arrayFingerprint: arr2,
            arrayCord: arr3
          })

        } else {

        }

      }
    });
  },
  selected1: function (e) {
    this.setData({
      selected1: true,
      selected2: false,
      selected3: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected1: false,
      selected2: true,
      selected3: false
    })
  },
  selected3: function (e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected3: true
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    //获取密码
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetPassWordInfo ', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "LeaguerInfoID": this.data.memberID
      },//请求参数
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        if (res.data.ErrorCode == "0000") {
          for (var i = 0; i < res.data.Data.length; i++) {
            //console.log(res.data.Data[i])
            for (var type in res.data.Data[i]) {
              if (type == 1) {
                arr1 = arr1.concat(res.data.Data[i][type])
              }
              if (type == 3) {
                arr2 = arr2.concat(res.data.Data[i][type])
              }
              if (type == 4) {
                arr3 = arr3.concat(res.data.Data[i][type])
              }
            }
          }
          //设置值
          that.setData({
            arrayPassword: arr1,
            arrayFingerprint: arr2,
            arrayCord: arr3
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //跳转到添加密码
  addPassword: function () {
    wx.navigateTo({
      url: '../../add-password/add-password?userName=' + this.data.name + '&phone=' + this.data.phone + '&dataID=' + this.data.memberID,
    })
  },
  //跳转到添加指纹
  addFingerprint:function(){
    wx.navigateTo({
      url: '../../add-fingerprint/add-fingerprint?userName=' + this.data.name + '&phone=' + this.data.phone + '&dataID=' + this.data.memberID,
    })
  },
  //跳转到添加卡片
  addCard: function () {
    wx.navigateTo({
      url: '../../add-cord/add-cord?userName=' + this.data.name + '&phone=' + this.data.phone + '&dataID=' + this.data.memberID,
    })
  }
})