// pages/device/add-fingerprint/add-fingerprint.js
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
    _deviceId: "",
    _serviceId: "",
    _characteristicId: "",
    content: [],
    commandId: "",
    time: "",
    isChecked:false,
    isShow:true,
    isHide:false,
    role:2,
    deviceID: "",
    btMac: "",
    name: "",
    phone: "",
    id: "",
    tenantID: "",
    valueID: "",
    texts:"按语音提示输入指纹",
    url:"../../../images/fingerprint_5.png",
    show: false,
    num:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var dataId = options.dataID
    //获取的id值存入data中
    that.setData({
      id: dataId
    })
    //判断哪种方式过来添加密码
    if (options.datas) {
      var datas = JSON.parse(options.datas)
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
    } else {
      //设置name和phone
      that.setData({
        name: options.userName,
        phone: options.phone
      })
    }
    //设置值
    this.setData({
      deviceID: getApp().globalData.DeviceID,
      btMac: getApp().globalData.BTMac,
      tenantID: getApp().globalData.TenantID,
      effectDate: getApp().globalData.VaildTime
    })
    //设置title
    wx.setNavigationBarTitle({
      title: '添加指纹',
      success: function (res) {
        // success
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
        // setTimeout(function () {
        //   //console.log(res)
        //   this.startBluetoothDevicesDiscovery()
        // }, 500)
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
  addFingerprint() {
    //设置显示隐藏
    if(this.data.isShow==true&&this.data.isHide==false){
      this.setData({
        isShow: false,
        isHide: true
      })
    }else{
      this.setData({
        isShow: true,
        isHide: false
      })
    }
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

    wx.request({
      url: 'https://iotapi.gtibee.com/API_Techphant/BTConfig', //请求接口的url
      method: 'POST', //请求方式
      data: { "deviceId": this.data.deviceID, "btMac": this.data.btMac, "category": 108, "time": time, "params": { "role": this.data.role, "superPwd": "123456", "effectDate": this.data.effectDate + ' ' + '00:00:00', "effectTimes": 255255} },
      // header: {
      //   'content-type': 'application/json' ,// 默认值,
      // },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        console.log(res)
        //请求成功
        var sArr = [];
        //var obj = eval('(' + res.data + ')');
        //var obj = JSON.parse(res.data);
        var obj = res.data;
        console.log(obj)
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
    var contents = this.data.content;
    // console.log(commandId)
    // console.log(times)
    // console.log(contents)
    for (var i = 0; i < contents.length; i++) {
      console.log(contents[i])
      wx.request({
        url: 'https://iotapi.gtibee.com/API_Techphant/BTResponse', //请求接口的url
        method: 'POST', //请求方式
        data: { "deviceId": this.data.deviceID, "btMac": this.data.btMac, "commandId": commandId, "category": 108, "status": 1, "content": contents[i], "time": times, "userId": "" },
        // header: {
        //   'content-type': 'application/json' ,// 默认值,
        // },
        complete() {  //请求结束后隐藏 loading 提示框
          wx.hideLoading();
        },
        success: (res) => {
          //var obj = JSON.parse(res.data);
          var obj = res.data;
          console.log(obj)
          if (obj.repCode == 20001) {
            if (this.data.num == 1) {
              console.log(this.data.num)
              //第一次录入
              this.setData({
                texts: "已完成第一次指纹录入 \n下一步：继续录入指纹",
                url: "../../../images/fingerprint_4.png",
                num:2
              })
              //console.log(this.data.num)
            }
             else if (this.data.num ==2) {
              console.log(this.data.num)
              //第二次录入
              this.setData({
                texts: "已完成第二次指纹录入 \n下一步：继续录入指纹",
                url: "../../../images/fingerprint_3.png",
                num:3
              })
              //console.log(this.data.num)
            }
            else if (this.data.num == 3) {
              console.log(this.data.num)
              //第三次录入
              this.setData({
                texts: "已完成第三次指纹录入 \n下一步：继续录入指纹",
                url: "../../../images/fingerprint_2.png",
                num:4
              })
              //console.log(this.data.num)
            }
          } 
          else if (obj.repCode == 50371){
            this.setData({
              show: true,
              texts: "指纹录入成功",
              url: "../../../images/fingerprint_1.png",
              valueID: obj.data.userId
            })
            //本地存储
            wx.setStorageSync('nickName', this.data.name);
            wx.setStorageSync('phoneNum', this.data.phone);
            wx.setStorageSync('valueID', this.data.valueID);
            wx.setStorageSync('nickID', this.data.id); 
          }
          else if (obj.errCode==50372 && obj.repCode == 50372) {
            //提示
            wx.showToast({
              title: '添加指纹失败',
              icon: 'loading',
              duration: 4000,
              mask: true
            })

          }
        },
        fail:res=>{
          console.log(res)
        }
      });
      
    }

  },
  next:function(){
    //跳转到保存卡片名称页面
    wx.navigateTo({
      url: 'add-fingerprint-detail/add-fingerprint-detail'
    })
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
  },
  startAddFingerprint:function(){
    wx.showModal({
      title: '提示',
      content: '请确认已完成以下操作：\r\n 1.已打开手机蓝牙；\r\n 2.打开电池盖，按下SET键，直到听到一次提示音',
      showCancel: false,
      confirmText: '确定',
      success:function(res){
        //console.log(res);
       // wx.writeBLECharacteristicValue();
        onBluetoothDeviceFound();
      }
    })
  },

  //设置是否是胁迫用户
  checkboxChange: function (e) {
    if (e.detail.value == true) {
      wx.showModal({
        title: '提示',
        content: '设为胁迫用户，开锁将发送报警信息',
        showCancel: false,
        confirmText: '确定'
      })
    }   
    let isChecked = e.currentTarget.dataset.checked;
    if (isChecked == "false" || isChecked == false) {     //即将选中   将其值设为true
      isChecked = true;
    } else {
      isChecked = false;
    }
    this.setData({
      isChecked: isChecked,
    });
    if (this.data.isChecked==true){
      this.setData({
        role: 3
      });
    }else{
      this.setData({
        role: 2
      });
    }
    // console.log(this.data.role)
  },


  
 
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