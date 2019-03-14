var testMatrix = 8

Page({
  data: {
    // text:"这是一个页面"
    titleWidth: 200,
    titleHeight: 200
  },
  onTap: function () {

    wx.redirectTo({
      url: '../test/test'
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    testMatrix = 8
    var pageWidth,pageHeight
    wx.getSystemInfo({
      success: function (res) {
        pageWidth = res.windowWidth
        pageHeight = res.windowHeight
      },
    })
    this.setData({
      titleWidth: pageWidth,
      titleHeight: pageWidth*1.4,
    })   
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  
})