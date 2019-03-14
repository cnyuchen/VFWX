var timer_id = 0
var timer_count = 0
var timer_end = 12
var max_timer = 16
var ctx
var myCanvasWidth, myCanvasHeight
var testArray = new Array()
var testMatrix = 8
var current_point = 0
var userinfo
var advanceMode = 1
var test_x = 0, test_y = 0
var currentQuadrant = 1
var util = require('../../utils/util.js');  

function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}


function initArray()
{
  //init test array
  testArray = []
  var block_size = myCanvasWidth / testMatrix
  var i, j, x, y
  var point = myCanvasWidth / 2
  for (i = 0; i < testMatrix; i++) {
    for (j = 0; j < testMatrix; j++) {
      x = j * block_size + block_size / 2
      y = i * block_size + block_size / 2
      if ((Math.pow((x - point), 2) + Math.pow((y - point), 2)) <= Math.pow((point), 2)) {
        testArray.unshift([j, i, 1])
      }
    }
  }
}

function isVolidePoint(index)
{
  if (testArray[index][2] <= 0) return false
  if (advanceMode == 0) return true

  var quadrant = 0

  if(testMatrix/2-1-testArray[index][0]>=0)
  {
    if(testMatrix/2-1-testArray[index][1]>=0)
    {
      quadrant = 2
    }
    else
    {
      quadrant = 3
    }
  }
  else
  {
    if (testMatrix / 2 - 1 - testArray[index][1] >= 0)
    {
      quadrant = 1
    }
    else
    {
      quadrant = 4
    }
  }

  if(quadrant != currentQuadrant) return false
  else return true

}

function calculateCenter()
{
  var x, y
  var canvasSize = myCanvasWidth
  var line_length = canvasSize / 20

  if (advanceMode == 0 || timer_id == 0) {
    x = canvasSize / 2
    y = canvasSize / 2
  }
  else {
    switch (currentQuadrant) {
      case 1:
        x = line_length / 2
        y = canvasSize - line_length / 2
        break
      case 2:
        x = canvasSize - line_length / 2
        y = canvasSize - line_length / 2
        break
      case 3:
        x = canvasSize - line_length / 2
        y = line_length / 2
        break
      case 4:
        x = line_length / 2
        y = line_length / 2
        break
      default:
        x = line_length / 2
        y = canvasSize - line_length / 2
        break
    }
  }
  return [x,y]
}
function pickNextPoint()
{
  //chose next display point
  do
  {
    var i, l, j
    l = testArray.length
    i = 0 | (Math.random() * l)
    j = i
    var count = 0

    do {
      if (j >= l) j = 0
      if (isVolidePoint(j)) break
      else {
        j++
        count++
      }

    } while (count <= l)

    if (isVolidePoint(j))
    {
      var block_size
      if (advanceMode == 0) {
        block_size = myCanvasWidth / testMatrix
      }
      else {
        block_size = (myCanvasWidth - myCanvasWidth/20) / (testMatrix / 2)
      }

      var res = calculateCenter()
      var c_x = res[0]
      var c_y = res[1]

      res[0] = testArray[j][0] * block_size + block_size/2 - testMatrix/2*block_size
      res[1] = testArray[j][1] * block_size + block_size/2 - testMatrix/2*block_size

      res[0]+=c_x
      res[1]+=c_y

      current_point = j
      return res
    }
    else if(currentQuadrant<4)
    {
      for(i=0;i<testArray.length;i++)
      {
        if(testArray[i][2]>0) break
      }
      if(i>=testArray.length) return null
      
      currentQuadrant++
      console.log(currentQuadrant)
      drawBackground(ctx)
      sleep(2000)
    }
    else
    {
      return null
    }
  } while (true)

}

function drawBackground(context)
{
  //填充背景色
  context.fillStyle = "#202000";
  context.fillRect(0, 0, myCanvasWidth, myCanvasHeight);

  //画十字线
  var x,y
  var res = calculateCenter()
  x = res[0]
  y = res[1]

  console.log(x,y)

  var line_length = myCanvasWidth/20
  context.setStrokeStyle('#ffff00')
  context.setLineWidth(2)
  context.moveTo(x - line_length / 2, y)
  context.lineTo(x + line_length / 2, y)
  context.moveTo(x, y - line_length / 2)
  context.lineTo(x, y + line_length / 2)
  context.stroke()

  context.draw()
}

function drawMatrix(context)
{
  var i,test_x,test_y
  var block_size = myCanvasWidth / testMatrix

  for(i=0;i<testArray.length;i++)
  {
    test_x = testArray[i][0] * block_size + block_size / 2
    test_y = testArray[i][1] * block_size + block_size / 2
    context.arc(test_x, test_y, myCanvasWidth / 150 , 0, 2 * Math.PI)
    context.setFillStyle("#aaaa00")
    context.fill()
    context.draw(true)  
  }

  
}

function onTimer()
{
  if (timer_count >= timer_end)
  {
    timer_count = 0
    timer_end = max_timer
    if(testArray[current_point][2]>0)
    {
      testArray[current_point][2]++
      if (testArray[current_point][2]>3)
        testArray[current_point][2] = 0
    }
  }
  
  if(timer_count == 0)  
  {
    var res = pickNextPoint()
  
    if(res!=null)
    {
      test_x = res[0]
      test_y = res[1]
    }
    else
    {
      //complete all points
      console.log("complete")
      clearInterval(timer_id)
      timer_id = 0
      
      try {
        wx.setStorageSync('testdata', testArray)
        wx.setStorageSync('testmatrix', testMatrix)
      } catch (e) { }

      var time = util.formatTime(new Date()); 

      const db = wx.cloud.database()
      var username
      var gender
      var province
      var city
      var country

      if(userinfo!=null)
      {
        username = userinfo.nickName
        gender = userinfo.gender
        province = userinfo.province
        city = userinfo.city
        country = userinfo.country
      }
      else
      {
        username = " "
        gender = 1
        province = " "
        city = " "
        country = " "
      }
     /*db.collection('counters').add({
        data: 
        {
          time: time,
          userName: username,
          gender: gender,
          province: province,
          city: city,
          country: country,
          user_data: JSON.stringify(testArray)
        }
      })*/
        
      wx.redirectTo({
        url: '../result/result'
      })
    }
  }
  
  var size = myCanvasWidth / 150
  var color = ["#666600","#aaaa00","#ffff00"]

  if(timer_count==0)
  {
    //display point
    ctx.arc(test_x, test_y, size, 0, 2 * Math.PI)
    ctx.setFillStyle(color[testArray[current_point][2]-1])
    ctx.fill()
    ctx.draw(true)
  }
  else if(timer_count==2)
  {
    ctx.arc(test_x, test_y, size+2, 0, 2 * Math.PI)
    ctx.setFillStyle("#202000")
    ctx.fill()
    ctx.draw(true)
  }

  timer_count++
}

Page({
  data: {
    // text:"这是一个页面"
    canvasWidth: 200,
    canvasHeight: 200,
    button1: "start.png",
    smallbuttonSize: 80,
    bigbuttonSize: 100
  },
  onTap: function () {
    },
 
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    testMatrix = 8
    
    wx.getUserInfo({
      success: function (res) {
        userinfo = res.userInfo
      },
      fail: (err) => { userinfo = null }
    })
    
    wx.getSystemInfo({
      success: function (res) {
        myCanvasWidth = res.windowWidth
        myCanvasHeight = res.windowHeight
      }
    })

    var canvasSize = Math.min(myCanvasWidth, myCanvasHeight)
    myCanvasWidth = canvasSize
    myCanvasHeight = canvasSize

    this.setData({
      canvasWidth: myCanvasWidth,
      canvasHeight: myCanvasWidth,
      smallbuttonSize: myCanvasWidth*0.3,
      bigbuttonSize: myCanvasWidth*0.4
    })   

    console.log(myCanvasWidth) 
    console.log(myCanvasHeight)
   
    initArray()

    timer_count = 0
    timer_end = max_timer
    currentQuadrant = 1
    current_point = 0
  
  },
  onReady: function () {
    // 页面渲染完成
    const context = wx.createCanvasContext('firstCanvas')
    ctx = context

    drawBackground(ctx)
    drawMatrix(ctx)

   },

  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
    if(timer_id != 0) {
      clearInterval(timer_id)
      timer_id = 0
    }
    wx.redirectTo({
      url: '../index/index'
    })
  },
  onUnload: function () {
    // 页面关闭
    if (timer_id != 0) {
      clearInterval(timer_id)
      timer_id = 0
    }    
  },
  onTapReset: function() {
    if(timer_id == 0) return
    var i
    for(i=0;i<testArray.length;i++)
      testArray[i][2] = 1
    current_point = 0
    timer_end = max_timer
    timer_count = -20
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;//音频自动播放设置
    innerAudioContext.src = '/pages/test/restart.mp3';//链接到音频的地址
  },
  onTapOK: function() {

    if (timer_id == 0)
    {
      //change the button picture
      this.setData({
        button1: "ok.png",
      })

      //clear the matrix
      drawBackground(ctx)

      //设定定时器
      timer_count = -20 //wait 2s
      timer_end = max_timer
      current_point = 0

      timer_id = setInterval(onTimer, 100)

      const innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.autoplay = true;//音频自动播放设置
      innerAudioContext.src = '/pages/test/start.mp3';//链接到音频的地址

      drawBackground(ctx)
    } 
    else if(timer_count>2)
    {
      if (testArray[current_point][2]>0)
      {
        testArray[current_point][2] *= -1
        timer_end = timer_count + (0 | (Math.random() * 10)) + 8
        const innerAudioContext = wx.createInnerAudioContext();
        innerAudioContext.autoplay = true;//音频自动播放设置
        innerAudioContext.src = '/pages/test/ok.mp3';//链接到音频的地址
      }
     }

    
 
  },
  onTapEnd: function() {
    if (timer_id == 0) return
    var i
    for(i=0;i<testArray.length;i++)
    {
      if(testArray[i][2]>0) testArray[i][2]*=-1
    }
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;//音频自动播放设置
    innerAudioContext.src = '/pages/test/continue.mp3';//链接到音频的地址
  },
  onSliderChange: function (e) {
    testMatrix = e.detail.value
    //redraw the matrix
    initArray()
    drawBackground(ctx)
    drawMatrix(ctx)
  }
})