// pages/device/member/menber.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tenantId:"",
    array:[],
    delBtnWidth: 160,
    leagID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设备成员',
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
          var newArr = res.data.Data
          for (var i = 0; i < newArr.length;i++){
            newArr[i]['txtStyle'] = ''
          }
          this.setData({
            array: newArr
          })  
        } else {
         
        }

      }
    });
  },
  onShow() { //返回显示页面状态函数
    //错误处理
    this.onLoad()//再次加载，实现返回上一页页面刷新
    //正确方法
    //只执行获取地址的方法，来进行局部刷新
  },
  showMemberDetail:function(e){
    let that = this
    var dataID = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../member/member-details/member-details?datas=' + JSON.stringify(that.data.array) + '&dataID=' + dataID
    })
  },
  addMember: function () {
    wx.navigateTo({
      url: 'add-member/add-member',
    })
  },
   //左滑删除功能---开始
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.array;
      list[index]['txtStyle'] = txtStyle;
      //更新列表的状态
      this.setData({
        array: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.array;
      var del_index = '';
      disX > delBtnWidth / 2 ? del_index = index : del_index = '';
      //console.log(index)
      //console.log(list[index].txtStyle)
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        array: list,
        del_index: del_index
      });
    }
  },
  //点击删除按钮事件
  delItem: function (e) {
    //console.log(e)
    var that = this;
    that.setData({
      leagID: e.currentTarget.dataset.itemid
    })
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://iotapi.gtibee.com/Api_Applet/DeleteLeaguer', //请求接口的url
            method: 'POST', //请求方式
            data: {
              "tenantId": getApp().globalData.TenantID,
              "leaguerId": that.data.leagID
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
              if (res.data.ErrorCode == "0000") {
                //成功提示
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true
                })
                var id = e.currentTarget.dataset.itemID;
                var index = e.currentTarget.dataset.index;
                //console.log(index)
                that.data.array.splice(index, 1);
                that.setData({
                  array: that.data.array
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'loading',
                  duration: 2000,
                  mask: true
                })
              }

            }
          });
        }
      }
    })
   
  }, 
  //左滑删除功能---结束


  //下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
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
          var newArr = res.data.Data
          for (var i = 0; i < newArr.length; i++) {
            newArr[i]['txtStyle'] = ''
          }
          that.setData({
            array: newArr
          })
          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
        }

      }
    });
  }
})