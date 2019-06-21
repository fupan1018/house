// pages/device/add-temporary-password/add-temporary-password.js
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
  data: {
    _deviceId: "",
    _serviceId: "",
    _characteristicId: "",
    content: [],
    commandId: "",
    time: "",
    userPwd: "",
    startTime: "",
    sendTime: "",
    tenantInfoID: '',
    array: [],
    deviceID: "",
    btMac: "",
    name: "",
    phone: "",
    tenantID: "",
    passwdId:"",
    valueId:"",
    index:0
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '时效密码',
      success: function (res) {
        // success
      }
    })
    //设置tenantId
    this.setData({
      deviceID: getApp().globalData.DeviceID,
      btMac: getApp().globalData.BTMac,
      tenantInfoID: getApp().globalData.TenantID
    })
    //console.log(this.data.tenantInfoID)
    //获取密码列表
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetPassWordInfoList', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "TenantInfoID": this.data.tenantInfoID,
        "PasswordType": 2
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
            array: res.data.Data
          })
          //console.log(this.data.array)
        } else {

        }
      }
    });
    wx.showModal({
      title: '提示',
      content: '请确认已完成以下操作：\r\n 1.已打开手机蓝牙；\r\n 2.打开电池盖，按下SET键，直到听到一次提示音',
      showCancel: false,
      confirmText: '确定'
    });
    wx.openBluetoothAdapter({
      success: (res) => {
        //console.log(res)
        setTimeout(function () {
          //console.log(res)
          this.startBluetoothDevicesDiscovery()
        }, 500)
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
        this.onBluetoothDeviceFound()
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
      //console.log(res)
      // var characterist = ab2hex(res.value)
      // console.log(characterist)
      // var data = {}
      // data = {
      //   content: ab2hex(res.value)
      // }
      // this.setData({ data });
      // console.log(data)
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
  delTimePasswd(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
    //console.log(index)
    //console.log(e)
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
    var time = '';
    time = Y + '-' + M + '-' + D + ' ' + h + ":" + m + ":" + s;
    //console.log(time)
    var valueId = e.currentTarget.dataset.valueid;
    var passwdId = e.currentTarget.dataset.id;
    //console.log(e.currentTarget.dataset.id)
    this.setData({
      passwdId: passwdId,
      valueId: valueId
    })
    //获取指令
    wx.request({
      url: 'https://iotapi.gtibee.com/API_Techphant/BTConfig', //请求接口的url
      method: 'POST', //请求方式
      data: { "deviceId": this.data.deviceID, "btMac": this.data.btMac, "category": 102, "time": time, "params": { "role": 2, "superPwd": "123456", "value": this.data.valueId, "effectDate": this.data.date2 + '\xa0' + this.data.time2, "effectTimes": 255255} },
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
        var obj = JSON.parse(res.data);
        //console.log(obj)
        for (var i = 0; i < obj.data.sendCommand.length; i++) {
          for (var keys in obj.data.sendCommand[i]) {
            if (obj.data.sendCommand[i][keys] != null) {
              sArr.push(obj.data.sendCommand[i][keys]);
            }

          }
        }
        this.setData({
          commandId: obj.data.commandId,
          time: time
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
          //console.log('writeBLECharacteristicValue failed', res.errMsg)
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
    // console.log(commandId)
    // console.log(times)
    // console.log(contents)
    for (var i = 0; i < contents.length; i++) {
      //console.log(contents[i])
      wx.request({
        url: getApp().globalData.url + '/API_Techphant/BTResponse', //请求接口的url
        method: 'POST', //请求方式
        data: { "deviceId": this.data.deviceID, "btMac": this.data.btMac, "commandId": commandId, "category": 102, "status": 1, "content": contents[i], "time": times, "userId": "" },
        // header: {
        //   'content-type': 'application/json' ,// 默认值,
        // },
        complete() {  //请求结束后隐藏 loading 提示框
          wx.hideLoading();
        },
        success: res => {
          var obj = JSON.parse(res.data);
          //console.log(obj)
          //成功提示
          if (obj.repCode == 50121) {
            //删除成功
            this.delTimepawd();
          } else if (obj.repCode == 50122) {
            wx.showToast({
              title: '删除失败',
              icon: 'success',
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
  //删除指纹密码
  delTimepawd: function () {
    wx.request({
      url: getApp().globalData.url + '/Api_Applet/DeletePassWordInfo', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "passwordinfoID": this.data.passwdId
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
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          this.data.array.splice(this.data.index, 1);
          this.setData({
            array: this.data.array
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
  },
  //转换ArrayBuffer
  string2buffer: function (str) {
    return new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },

  //下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'https://iotapi.gtibee.com/Api_Applet/GetPassWordInfoList', //请求接口的url
      method: 'POST', //请求方式
      data: {
        "TenantInfoID": that.data.tenantInfoID,
        "PasswordType": 2
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
            array: res.data.Data
          })
          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
          //console.log(this.data.array)
        }
      }
    });
  },
  /**
   * 用户分享
   */
  shareBtn: function (e) {
    //console.log(e)
    wx.navigateTo({
      url: '../time-password/time-detail/time-detail?name=' + e.target.dataset.name + '&password=' + e.target.dataset.password + '&time=' + e.target.dataset.time
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
