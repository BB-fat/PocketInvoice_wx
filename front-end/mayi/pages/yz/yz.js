//pages / yz /yz.js
const app = getApp();
import {
  sendmsg
} from "../normal.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    color: '',
    inputValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    my.showLoading({
      content: "获取验证码"
    });
    //刷新验证码
    sendmsg(JSON.stringify({
      "cmd": 104,
    }))
    that.setData({
      windowHeight: app.globalData.windowHeight
    })
    my.onSocketMessage(function (res) {
      my.hideLoading()
      console.log('recieve:' + res.data)
      var data = JSON.parse(res.data);
      //服务器返回查询结果
      if (data['cmd'] == 202) {
        my.offSocketMessage()
        my.redirectTo({
          url: '../result/result?data=' + res.data,
        })
      }
      //输入验证码失败
      else if (data['cmd'] == 203) {
        that.setData({
          inputValue: ''
        })
        //验证码失效，自动更换
        if (data['error'] == '验证码失效!') {
          var t_data = JSON.stringify({
            "cmd": 104,
          })
          sendmsg(t_data)
          my.showLoading({
            title: '验证码失效',
          })
          return 0;
        }
        //超次数返回主页
        else if (data['error'] == "超过该张发票当日查验次数(请于次日再次查验)!") {
          my.showToast({
            title: data['error'],
            icon: 'none',
            duration: 2000,
          })
          my.offSocketMessage()
          setTimeout(function () {
            my.switchTab({
              url: '../index/index',
            });
          }, 2000)
        }
        else if (data['error'] == '不一致') {
          my.showToast({
            content: data['error'],
            duration: 2000,
          })
          setTimeout(function(){
            my.switchTab({
              url: '../index/index', 
            });
          },2000)
        }
        //其他错误
        else {
          my.showToast({
            content: data['error'],
            duration: 2000,
          })
        }
      }
      //接收验证码
      else if (data['cmd'] == 204) {
        that.setData({
          inputValue: ''
        })
        that.setData({
          url: data['verity_code_link'],
          color: data['verity_code_word']
        })
      }
    }) //end onsocketmessage
  }, //end onload

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //发送验证码
  send: function (e) {
    //如果用户没有输入验证码，提示输入
    if (this.data.inputValue == '') {
      my.showToast({
        content: '请输入验证码',
        duration: 1000
      })
      return 0;
    }
    var t_data = JSON.stringify({
      "verity_code": this.data.inputValue,
      "cmd": 103,
    })
    sendmsg(t_data)
    my.showLoading({
      title: '正在提交',
    })
  }, //end send

  //更换验证码
  change: function () {
    var t_data = JSON.stringify({
      "cmd": 104,
    })
    sendmsg(t_data)
    my.showLoading({
      title: '正在更换验证码',
    })
  },
})