//app.js

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    /*wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 
            }
          })
        }
      }
    })*/

    console.log ("App Load")
  },
  
  onShow: function () {
    console.log ("App Show")
  },

  onHide: function () {
    console.log("App Hide")
  }
})