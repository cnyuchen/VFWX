
var testArray
var myCanvasWidth, myCanvasHeight
var testMatrix

Page({
  data: {
    canvasWidth: 200,
    canvasHeight: 200
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.getSystemInfo({
      success: function (res) {
        myCanvasWidth = res.windowWidth
        myCanvasHeight = res.windowHeight
      },
    })
    this.setData({
      canvasWidth: myCanvasWidth,
      canvasHeight: myCanvasWidth
    })

    //load data from catch
    testArray = wx.getStorageSync("testdata")  
    testMatrix = wx.getStorageSync("testmatrix")
  },
  onReady: function () {
    // 页面渲染完成
    const context = wx.createCanvasContext('firstCanvas')

    //填充背景色
    context.fillStyle = "#202000";
    context.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);

    //画十字线
    var c_size = this.data.canvasWidth
    var line_length = c_size / 20

    context.setStrokeStyle('#ffff00')
    context.setLineWidth(2)
    context.moveTo(c_size / 2 - line_length / 2, c_size / 2)
    context.lineTo(c_size / 2 + line_length / 2, c_size / 2)
    context.moveTo(c_size / 2, c_size / 2 - line_length / 2)
    context.lineTo(c_size / 2, c_size / 2 + line_length / 2)
    context.stroke()

    //draw result
    var i,l
    var block_size = myCanvasWidth / testMatrix
    var color = ["#000000","#ffffff","#aaaaaa","#555555"]
    for(i=0;i<testArray.length;i++)
    {
      context.setFillStyle(color[testArray[i][2]*-1])
      context.fillRect(block_size*testArray[i][0]+2,block_size*testArray[i][1]+2, block_size-4, block_size-4)
    }
    context.draw()
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
    /*wx.redirectTo({
      url: '../index/index'
    })*/
  },
  onUnload: function () {
    // 页面关闭
    wx.redirectTo({
      url: '../index/index'
    })
  },
  onTapSave: function () {
    //save to local
    var tempPath
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        tempPath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempPath,
          success: (res) => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000//持续的时间
            })
          },
          fail: (err) => { }
        })        
      }
    })
  },
  onShareAppMessage: function(options) {
    var shareObj = {
      　　　　title: "光明小卫士，保护你的视力！",        
      　　　　path: '/pages/index/index',        
      　　　　imageUrl: '/pages/index/title.jpg'
    }

    return shareObj
  },
  onTapReturn: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  }
})
