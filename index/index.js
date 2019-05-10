Page({
  onLoad() {
    this.ctx = wx.createCameraContext()
    this.setData({
      camera_flag: true,
    })
  },
  takePhoto() {
    if (this.data.camera_flag) {
      this.ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.setData({
            camera_flag: false,
            src: res.tempImagePath
          })
          console.log("img_path", res.tempImagePath)
          wx.showLoading({
            title: '加载中',
          })
          var that = this
          wx.uploadFile({
            url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
            filePath: res.tempImagePath,
            name: 'image_file',
            formData: {
              api_key: 'WABoHJ4JmUxA_cO2So8N-SO01Si0WPAy',
              api_secret: 'ocVjudlTHVg7RoooT03yJDiFm0wahou2',
              return_attributes: 'gender,age,skinstatus'
            },
            success(res) {
              wx.hideLoading()
              const face_data = JSON.parse(res.data)
              console.log("face++",face_data)
              if (face_data.faces.length > 0) {
                const my_data = new Date()
                // 0 - 6
                const week = my_data.getDay()
                const age = face_data.faces[0].attributes.age.value
                const gender = face_data.faces[0].attributes.gender.value == "Female" ? "女" : "男"
                const skinshealth = face_data.faces[0].attributes.skinstatus.health
                const acne = face_data.faces[0].attributes.skinstatus.acne
                const dark_circle = face_data.faces[0].attributes.skinstatus.dark_circle

                let health = ""
                let value = 0
                let value_age = 0
                let value_health = 0
                let value_acne = 0
                let value_dark = 0 

                if(skinshealth>=5 &&  skinshealth<10)
                {
                  health = "身体一般", value_health = 10
                }
                else if (skinshealth >=10)
                {
                  health = "身体健康", value_health = 20
                }
                else health = "身体不佳", value_health = 5

                let skin = ""
                let skin_ = ""
                if(acne>=20){
                  skin = "痘多", value_acne = 5, skin_ = "较多的"
                }
                else if(acne>=5 && acne<20){
                  skin = "痘少", value_acne = 10, skin_ = "较少的"
                }
                else skin = "无痘", value_acne = 15, skin_ = "几乎没有"

                let dark = ""
                if (dark_circle >= 50) {
                  dark = "明显的", value_dark = 0
                }
                else if (dark_circle >= 20 && dark_circle < 50) {
                  dark = "轻微的", value_dark = 5
                }
                else dark = "略微的", value_dark = 10

                let people= ""
                console.log("test", [0, 6].indexOf(week))
                if([0,6].indexOf(week)>-1) {
                  if (gender == "男") {
                    if (age >= 0 && age < 6) { value_age = 0; people = "学前儿童"} 
                    else if (age >= 6 && age < 12) { value_age = 30; people = "儿童"}
                    else if (age >= 12 && age < 18) { value_age = 45; people = "青少年"}
                    else if (age >= 18 && age < 30) { value_age = 60; people = "青年"}
                    else { value_age = 90; people = "中老年"}
                  }
                  else {
                    if (age >= 0 && age < 6) { value_age = 0; people = "学前儿童" } 
                    else if (age >= 6 && age < 12) { value_age = 20; people = "儿童" }
                    else if (age >= 12 && age < 18) { value_age = 30; people = "青少年" }
                    else if (age >= 18 && age < 30) { value_age = 45; people = "青年" }
                    else { value_age = 75; people = "中老年" }
                  }
                } else {
                  if (gender == "男") {
                    if (age >= 0 && age < 6) { value_age = 0; people = "学前儿童" }
                    else if (age >= 6 && age < 12) { value_age = 15; people = "儿童" }
                    else if (age >= 12 && age < 18) { value_age = 30; people = "青少年" }
                    else if (age >= 18 && age < 30) { value_age = 45; people = "青年" }
                    else { value_age = 60; people = "中老年" }
                  }
                  else{
                    if (age >= 0 && age < 6) { value_age = 0; people = "学前儿童" }
                    else if (age >= 6 && age < 12) { value_age = 10; people = "儿童" }
                    else if (age >= 12 && age < 18) { value_age = 20; people = "青少年" }
                    else if (age >= 18 && age < 30) { value_age = 30; people = "青年" }
                    else { value_age = 40; people = "中老年" }
                  }
                }
                if (age >= 0 && age < 6)
                {
                  value = 0;
                }
                else value = value_acne + value_age + value_dark + value_health

                let weekstring= ""
                switch(week){
                  case 0:weekstring= "日"; break;
                  case 1: weekstring = "一"; break;
                  case 2: weekstring = "二"; break;
                  case 3: weekstring = "三"; break;
                  case 4: weekstring = "四"; break;
                  case 5: weekstring = "五"; break;
                  default: weekstring = "六"
                }

                let listData = [
                  { "code": "短视频类", "text": value*0.8, "type": "type1" },
                  { "code": "社交类", "text": value, "type": "type2" },
                  { "code": "游戏类", "text": value*0.6, "type": "type3" },
                  { "code": "效率类", "text": value*1.2, "type": "type4" },
                  { "code": "阅读类", "text": value*1.5, "type": "type5" },
                ]
                that.setData({
                  weekstring: weekstring,
                  age: age,
                  gender: gender,
                  people: people,
                  value: value,
                  health: health,
                  skin: skin,
                  skin_: skin_, //痘痘的多少，较多还是较少
                  dark: dark,
                  listData: listData
                })
                // console.log("that_value",that.data.value)

              }
            }
          })
        }
      })
    } else {
      this.setData({
        camera_flag: true
      })
    }

  },
  
  error(e) {
    console.log(e.detail)
  }
})