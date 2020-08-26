// version v0.0.1
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 公共变量
const cookies1 = process.env.JD_COOKIE1
const cookies2 = process.env.JD_COOKIE2
const cookies3 = process.env.JD_COOKIE3
const bark = process.env.PUSH_KEY

async function downFile () {
    const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js'
    await download(url, './')
}

async function changeFiele () {
   let raw_content = await fs.readFileSync('./JD_DailyBonus.js', 'utf8')
   content1 = raw_content.replace(/var Key = ''/, `var Key = '${cookies1}'`)
   content2 = raw_content.replace(/var Key = ''/, `var Key = '${cookies2}'`)
   content3 = raw_content.replace(/var Key = ''/, `var Key = '${cookies3}'`)
   await fs.writeFileSync( './jd1.js', content1, 'utf8')
   await fs.writeFileSync( './jd2.js', content2, 'utf8')
   await fs.writeFileSync( './jd3.js', content3, 'utf8')
}

async function sendNotify (text,desp) {
  const options ={
    uri:  `https://api.day.app/${bark}/${text}/${desp}`,
    method: 'GET'
  }
  await rp.post(options).then(res=>{
    console.log(res)
  }).catch((err)=>{
    console.log(err)
  })
}

async function start() {
  // 下载最新代码
  await downFile();
  console.log('下载代码完毕')
  
  // 替换变量
  await changeFiele();
  console.log('替换变量完毕')
  // 执行
  await exec("node jd1.js >> result.txt");
  await exec("node jd2.js >> result.txt");
  await exec("node jd3.js >> result.txt");
  console.log('执行完毕')

  if (bark) {
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
      content = fs.readFileSync(path, "utf8");
      console.log(content)
    }
    await sendNotify("京东签到  " + new Date().toLocaleDateString(), content);
    console.log('发送结果完毕')
  }
}

start()
