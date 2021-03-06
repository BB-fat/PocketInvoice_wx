// pages/manual/manual.js
import {
  checksocket,
  sendmsg,
  checkdata,
  getNowFormatDate,
} from "../normal.js"

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_save: {
      tapFun: 'saveinvoice',
      text: "入录发票",
      color: "#2FBAA5",
      width: 620,
      mode: "mid"
    },
    btn_check: {
      tapFun: 'tapQueryEvent',
      text: "单张查验",
      color: "#5087C8",
      width: 620,
      mode: "mid"
    },
    data: {
      fp_dm: '',
      fp_hm: '',
      kp_je: '',
      kp_rq: '点击选择日期',
      jy: '',
    },
    start: '',          //开始日期（当前日期前一年）
    end: '',            //结束日期
  },

  //选择日期
  choosedate: function(e) {
    this.data.data['kp_rq'] = e.detail['value'].replace(/-/g, '')
    this.setData({
      data: this.data.data
    })
  },

  //以下一组函数为绑定输入函数
  fp_dm: function(e) {
    this.data.data['fp_dm'] = e.detail.value
    this.setData({
      data: this.data.data
    })
  },

  fp_hm: function(e) {
    this.data.data['fp_hm'] = e.detail.value
    this.setData({
      data: this.data.data
    })
  },

  kp_je: function(e) {
    this.data.data['kp_je'] = e.detail.value
    this.setData({
      data: this.data.data
    })
  },

  jy: function(e) {
    this.data.data['jy'] = e.detail.value
    this.setData({
      data: this.data.data
    })
  },

  //单张查验
  tapQueryEvent: function() {
    var t_data = this.data.data
    //简单检查发票信息正确性
    if (checkdata(t_data) == false) {
      return
    }
    t_data['cmd'] = 102
    sendmsg(JSON.stringify(t_data))
    wx.showLoading({
      title: '正在获取验证码',
      mask: true
    })
  },

  //存储发票
  saveinvoice: function() {
    var t_data = this.data.data
    //简单检查发票信息正确性
    if (checkdata(t_data) == false) {
      return
    }
    t_data['cmd'] = 110
    sendmsg(JSON.stringify(t_data))
  },


  onLoad: function() {
    //设定picker的可选时间段
    this.setData({
      end: getNowFormatDate(0),
      start: getNowFormatDate(1),
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.onSocketMessage(function(res) {
      console.log('recieve:' + res.data)
      var data = JSON.parse(res.data)
      //服务器带回验证码
      if (data['cmd'] == 200) {
        wx.redirectTo({
          url: '../yz/yz?url=' + data['verity_code_link'] + '&color=' + data['verity_code_word'],
        })
      }
      //录入发票成功
      else if (data['cmd'] == 205) {
        wx.hideLoading()
        wx.showToast({
          title: '录入成功',
          icon: 'success',
        })
        setTimeout(function() {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1000)
      }
      //线上检测发票信息错误
      else if (data['cmd'] == 206) {
        wx.hideLoading()
        wx.showToast({
          title: '发票信息错误',
          icon: 'none',
        })
      }
      //发票代码错误
      else if (data['cmd'] == 211) {
        wx.hideLoading()
        wx.showToast({
          title: '发票代码错误',
          icon: "none",
        })
      }
    })
  },
})