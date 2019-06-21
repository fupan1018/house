// pages/repair/repair.js
var dateTimePicker = require('../../../utils/dateTimePicker');
const app = getApp()
Page({
  data: {
    date: '',
    time1: '09:00',
    time2: '16:00',
    src: '',
    questions:[
      { "data_name": "打不开", "state": 0,"problemType":0},
      { "data_name": "漏电", "state": 0, "problemType":1},
      { "data_name": "异常响动", "state": 0, "problemType": 2},
      { "data_name": "网关离线维修", "state": 0, "problemType": 3},
      { "data_name": "电量不足、没电", "state": 0, "problemType": 4},
      { "data_name": "无法设置、修改密码", "state": 0, "problemType": 5},
      { "data_name": "网关丢失", "state": 0, "problemType": 6}
    ],    
    problemType:[],
    areaName: '',
    nodeName: '',
    nodeID: '',
    tenantID: '',
    describe:'',
    creatTime:''
  },
  onLoad() {
    this.ctx = wx.createCameraContext()
    wx.setNavigationBarTitle({
      title: '报修预约',
      success: function (res) {
        // success
      }
    })
    this.setData({
      areaName: getApp().globalData.AreaName,
      nodeName: getApp().globalData.NodeName,
      nodeID: getApp().globalData.NodeID,
      tenantID: getApp().globalData.TenantID
    })
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时  
    var h = date.getHours();
    //分  
    var m = date.getMinutes();
    //秒  
    var s = date.getSeconds();
    // 定义时间
    var date = '';
    date = Y + '-' + M + '-' + D ;
    // 定义时间
    var time = '';
    time = Y + '-' + M + '-' + D + ' ' + h + ":" + m + ":" + s;
    this.setData({
      date: date,
      creatTime:time
    })
  },
  //选择日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //选择第一个时间
  bindTimeChange1(e) {
    this.setData({
      time1: e.detail.value
    })
  },
  //选择第二个时间
  bindTimeChange2(e) {
    this.setData({
      time2: e.detail.value
    })
  },
  takePhoto: function () {
    var _this = this
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        console.log(res)
        _this.setData({
          src: res.tempFilePaths
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }  
    } ) 
  },
  //选择问题的选中方法
  selection: function (e) {
    var index = e.currentTarget.dataset.key;
    if (this.data.questions[index].state == 1) {
      this.data.questions[index].state = 0;     
    } else if (this.data.questions[index].state == 0) {
      this.data.questions[index].state = 1;      
    }
    this.setData({
      questions: this.data.questions,
      problemType: this.data.problemType.concat(index)
    }); 
  },
  //获取用户输入的问题描述
  questionInput: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  //提交报修
  addRepairBtn:function(){
    wx.uploadFile({
      url: 'https://iotapi.gtibee.com/Api_Applet/AddRepairInfo',
      filePath: this.data.src.toString(),
      name: 'uploadFile',
      formData: {
        "NodeID": this.data.nodeID,
        "ProblemType": this.data.problemType.join(","),
        "Describe": this.data.describe,
        "CreateTime": this.data.creatTime,
        "CreateUserID": this.data.tenantID,
        "StartTime": this.data.date +'\xa0'+this.data.time1,
        "EndTime": this.data.date + '\xa0' + this.data.time2,
      },
      success: function (res) {   
        //console.log(res)
        var data = JSON.parse(res.data)
        console.log(data)
        if (data.ErrorCode=="0000"){
          wx.showToast({
            title: '信息提交成功',
            icon: 'success',
            duration: 3000,
            mask: true
          })
        }
        //console.log('刷新成功')
      }
    })
  }
})
