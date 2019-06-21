// pages/device/add-temporary-password/add-temporary-password.js
var dateTimePicker = require('../../../utils/dateTimePicker');
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
  data: {
    date1: '',
    date2: '',
    time1: '09:00',
    time2: '16:00',
    _deviceId: "",
    _serviceId: "",
    _characteristicId: "",
    content: [],
    commandId: "",
    time: "",
    userPwd:"",
    startTime:"",
    sendTime:"",
    deviceID: "",
    btMac: "",
    tenantID: "",
    passName:"",
    valueID:""
  },
  onLoad() {
    //设置值
    this.setData({
      deviceID: getApp().globalData.DeviceID,
      btMac: getApp().globalData.BTMac,
      tenantID: getApp().globalData.TenantID,
      nodeID: getApp().globalData.NodeID
    })
    wx.setNavigationBarTitle({
      title: '时效密码',
      success: function (res) {
        // success
      }
    })
    // // 获取完整的年月日 时分秒，以及默认显示的数组
    // var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // // 精确到分的处理，将数组的秒去掉
    // var lastArray = obj1.dateTimeArray.pop();
    // var lastTime = obj1.dateTime.pop();
    
    // this.setData({
    //   dateTime: obj.dateTime,
    //   dateTime1: obj1.dateTime,
    //   dateTimeArray: obj.dateTimeArray,
    //   dateTimeArray1: obj1.dateTimeArray,
    // });
    // var time1 = this.data.dateTimeArray[0][this.data.dateTime[0]] + '-' + this.data.dateTimeArray[1][this.data.dateTime[1]] + '-' + this.data.dateTimeArray[2][this.data.dateTime[2]] + '\xa0\xa0' + this.data.dateTimeArray[3][this.data.dateTime[3]] + ':' + this.data.dateTimeArray[4][this.data.dateTime[4]]
    // var time2 = this.data.dateTimeArray1[0][this.data.dateTime1[0]] + '-' + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + '-' + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + '\xa0\xa0' + this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ':' + this.data.dateTimeArray1[4][this.data.dateTime1[4]] 
    // this.setData({
    //   startTime: time1,
    //   endTime: time2,
    // })
    // console.log(this.data.startTime)
    // console.log(this.data.endTime)
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
    date = Y + '-' + M + '-' + D;
    // 定义时间
    var time = '';
    time = Y + '-' + M + '-' + D + ' ' + h + ":" + m + ":" + s;
    this.setData({
      date1: date,
      date2: date,
      creatTime: time,
      time:time
    })
    wx.showModal({
      title: '提示',
      content: '请确认已完成以下操作：\r\n 1.已打开手机蓝牙；\r\n 2.打开电池盖，按下SET键，直到听到一次提示音',
      showCancel: false,
      confirmText: '确定'
    });
    wx.openBluetoothAdapter({
      success: (res) => {
        //console.log(res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            //console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  //选择日期
  bindDateChange1(e) {
    this.setData({
      date1: e.detail.value
    })
  },
  //选择第一个时间
  bindTimeChange1(e) {
    this.setData({
      time1: e.detail.value
    })
  },
  //选择日期
  bindDateChange2(e) {
    this.setData({
      date2: e.detail.value
    })
  },
  //选择第二个时间
  bindTimeChange2(e) {
    this.setData({
      time2: e.detail.value
    })
  },
  onUnload() {
    this.closeBluetoothAdapter()
  },
  //蓝牙
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        //console.log('startBluetoothDevicesDiscovery success', res)
        setTimeout(function () {
          //console.log(res)
          this.startBluetoothDevicesDiscovery()
        }, 500)
      },
    })
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        var items = device.deviceId.split(":");
        var deviceID = items.join("")
        if (deviceID == this.data.btMac) {
          this.createBLEConnection(device.deviceId)
        }
        //this.createBLEConnection();
      })
    });
  },
  createBLEConnection(obj) {
    const deviceId = obj
    //const name = ds.name
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        //console.log(res)
        this.setData({
          connected: true,
          //name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        //console.log(res)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            //this.writeBLECharacteristicValue()
            this.setData({
              _deviceId: deviceId,
              _serviceId: serviceId,
              _characteristicId: item.uuid,
            })
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((res) => {
      this.setData({
        "content": []
      })
      if (res.value) {
        this.setData({
          "content": this.data.content.concat(ab2hex(res.value))
        })
        //console.log(1, this.data.content)
      }
      //蓝牙回复
      this.responseValue();
    })
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  //获取输入框密码
  passWdInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  //获取密码名称
  nameInput:function(e){
    this.setData({
      passName: e.detail.value
    })
  },

  //添加密码
  confirmBtn() {
    //获取指令
    wx.request({
      url: 'https://iotapi.gtibee.com/API_Techphant/BTConfig', //请求接口的url
      method: 'POST', //请求方式
      data: { "deviceId": this.data.deviceID, "btMac": this.data.btMac, "category": 101, "time": this.data.time, "params": { "role": 2, "superPwd": "123456", "valueNew": this.data.userPwd, "effectDate": this.data.date2 + ' ' + this.data.time2, "effectTimes": 255255 } },
      // header: {
      //   'content-type': 'application/json' ,// 默认值,
      // },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(res)
        //请求成功
        var sArr = [];
        //var obj = eval('(' + res.data + ')');
        var obj = res.data;;
        //console.log(obj)
        for (var i = 0; i < obj.data.sendCommand.length; i++) {
          for (var keys in obj.data.sendCommand[i]) {
            if (obj.data.sendCommand[i][keys] != null) {
              sArr.push(obj.data.sendCommand[i][keys]);
            }

          }
        }
        //console.log(sArr)
        this.setData({
          commandId: obj.data.commandId,
          time: this.data.time
        })
        //发送指令
        this.writeBLECharacteristicValue(sArr, obj.data.sendCommand.length);
      }
    });
  },
  //发送指令
  writeBLECharacteristicValue(sArr, lengths) {
    for (var i = 0; i < lengths; i++) {
      wx.writeBLECharacteristicValue({
        deviceId: this._deviceId,
        serviceId: this._serviceId,
        characteristicId: this._characteristicId,
        value: this.string2buffer(sArr[i]),
        success(data) {
          //console.log(data)
          //请求成功
        },
        fail: function (res) {
          console.log('writeBLECharacteristicValue failed', res.errMsg)
        }
      })
      sleep(0.02)
    }

  },
  //蓝牙回复
  responseValue() {
    var commandId = this.data.commandId;
    var times = this.data.time;
    var contents = this.data.content
    for (var i = 0; i < contents.length; i++) {
      wx.request({
        url: 'https://iotapi.gtibee.com/API_Techphant/BTResponse', //请求接口的url
        method: 'POST', //请求方式
        data: { "deviceId": this.data.deviceID, "btMac": this.data.btMac, "commandId": commandId, "category": 101, "status": 1, "content": contents[i], "time": times, "userId": "" },
        // header: {
        //   'content-type': 'application/json' ,// 默认值,
        // },
        complete() {  //请求结束后隐藏 loading 提示框
          wx.hideLoading();
        },
        success: res => {
          var obj = res.data;
          //console.log(obj)
          if (obj.repCode == 50111) {
            this.setData({
              valueID: obj.data.userId
            })
            //成功提示
            this.addTemporaryPass()
          } else if (obj.repCode == 50112) {
            wx.showToast({
              title: '该密码已存在，请勿重复设置',
              icon: 'loading',
              duration: 2000,
              mask: true
            });

          } else if (obj.repCode == 404007) {
            wx.showToast({
              title: '添加门卡失败',
              icon: 'loading',
              duration: 2000,
              mask: true
            })
          }
         
        },
        fail: res => {
          
        }

      });
    }

  },
  addTemporaryPass(){
    console.log(this.data.nodeID)
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/AddPassWordInfo', //请求接口的url
      method: 'POST', //请求方式
      data: { "PasswordType": 2, "Fingerprint": this.data.passName, "PasswordContent": this.data.userPwd, "IdentityCard": "成员", "CreateUser": this.data.tenantID, "StartTime": this.data.date1 + '\xa0' + this.data.time1, "EndTime": this.data.date2 + '\xa0' + this.data.time2, "ValueID": this.data.valueID, "NodeID": this.data.nodeID},
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        if (res.data.ErrorCode == "0000") {
          //成功提示
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 3000,
            mask: true
          })
          wx.navigateTo({
            url: '../../device',
          })
        }
      },
      fail: res => {

      }
    });
  },
  //转换ArrayBuffer
  string2buffer: function (str) {
    return new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    wx.openBluetoothAdapter({
      success: (res) => {
        //console.log(res)
        that.startBluetoothDevicesDiscovery()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            //console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              that.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  }
})
// //sleep函数
function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime)
      return;
  }
}
