
# <a name="0">硬核桃 5G 平台 接口规范</a>

> 整理于《中国电信-中国联通 5G 消息业务平台行业客户接入接口技术规范 V1.0.4》

## <a name="1">一、目录</a>

&emsp;<a href="#1">一、目录</a>  
&emsp;<a href="#2">二、参数说明</a>  
&emsp;&emsp;<a href="#3">1. url参数说明</a>  
&emsp;&emsp;<a href="#4">2. 请求头参数</a>  
&emsp;&emsp;<a href="#5">3. 返回码说明</a>  
&emsp;&emsp;<a href="#6">4. 接口频率限制说明</a>  
&emsp;<a href="#7">三、基础能力接口</a>  
&emsp;&emsp;<a href="#8">1. 获取 accessToken</a>  
&emsp;&emsp;<a href="#9">2. 身份鉴权</a>  
&emsp;<a href="#10">四、Chatbot 信息管理</a>  
&emsp;&emsp;<a href="#11">1. Chatbot 基本信息</a>  
&emsp;&emsp;<a href="#12">2. Chatbot 固定菜单</a>  
&emsp;&emsp;<a href="#13">3. Chatbot 信息获取</a>  
&emsp;<a href="#14">五、媒体素材管理</a>  
&emsp;&emsp;<a href="#15">1. 媒体素材上传</a>  
&emsp;&emsp;<a href="#16">2. 媒体素材下载</a>  
&emsp;&emsp;<a href="#17">3. 媒体素材删除</a>  
&emsp;<a href="#18">六、Chatbot 发送消息（消息单发）</a>  
&emsp;&emsp;<a href="#19">1. 文本消息 + 消息回落</a>  
&emsp;&emsp;<a href="#20">2. 文本消息 + 悬浮菜单</a>  
&emsp;&emsp;<a href="#21">3. 文件消息 </a>  
&emsp;&emsp;<a href="#22">4. 地理位置回落消息</a>  
&emsp;&emsp;<a href="#23">5. 富媒体卡片消息(带 CSS 样式) + Suggestions </a>  
&emsp;&emsp;<a href="#24">6. 富媒体多卡片消息(带 CSS 样式) + Suggestions</a>  
&emsp;&emsp;<a href="#25">7. 富媒体卡片消息语法</a>  
&emsp;&emsp;<a href="#26">8. 群发消息（文本消息）</a>  
&emsp;<a href="#27">七、Chatbot 发送撤回消息</a>  
&emsp;&emsp;<a href="#28">1. 请求撤回单条消息</a>  
&emsp;&emsp;<a href="#29">2. 请求撤回多条消息</a>  
&emsp;<a href="#30">八、Chatbot 接收消息</a>  
&emsp;&emsp;<a href="#31">1. 文本消息</a>  
&emsp;&emsp;<a href="#32">2. 文件消息</a>  
&emsp;&emsp;<a href="#33">3. 地理位置回落消息</a>  
&emsp;&emsp;<a href="#34">4. 建议回复消息的回复</a>  
&emsp;&emsp;<a href="#35">5. 终端数据共享消息</a>  
&emsp;<a href="#36">九、Chatbot 接收下行消息的状态报告 </a>  
&emsp;<a href="#37">十、消息通知</a>  
&emsp;&emsp;<a href="#38">1. Chatbot 信息变更通知</a>  
&emsp;&emsp;<a href="#39">2. 终端举报通知</a>  
&emsp;&emsp;<a href="#40">3. 审核结果通知</a>  
&emsp;<a href="#41">十一、富媒体卡片支持的 CSS 属性说明</a>  


## <a name="2">二、参数说明</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

### <a name="3">1. url参数说明</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

| 序号 | 字段       | 数据类型 | 可选属性 | 描述                                                         |
| ---- | ---------- | -------- | -------- | ------------------------------------------------------------ |
| 1    | severRoot  | string   | 必选     | 服务器基础URL: hostname+port+base <br />Port和base path可选<br />例: example.com/exampleAPI |
| 2    | apiVersion | string   | 必选     | 客户端想使用的API版本号 <br />例: "v1"                       |
| 3    | chatbotId  | string   | 必选     | 行业消息的统一服务地址(Chatbot接 入号)，客户端可根据此地址将所有通 知集合展现。 |

### <a name="4">2. 请求头参数</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

| 序号 | 字段           | 数据类型 | 可选属性                  | 描述                                                         |
| ---- | -------------- | -------- | ------------------------- | ------------------------------------------------------------ |
| 1    | authorization  | string   | 必选（除获取accessToken） | 调用接口凭证<br />例：accessToken TXlwdndOZG0yWTpjUml0dHMzM1dKRnBXRUdD |
| 2    | content-type   | string   | 必选                      | 发送的内容类型， 本协议取值 <br />application/json           |
| 3    | accept         | string   | 必选                      | 接受的数据类型类型，本协议取值<br /> application/json        |
| 4    | host           | string   | 必选                      | 请求服务器的域名/IP地址和端口号                              |
| 5    | date           | string   | 必选                      | 消息时间戳，默认标准Gmt表达方式 <br />例如：Date: Tue, 15 Nov 2019 08:12:31 GMT |
| 6    | content-length | long     | 可选                      | 内容长度                                                     |

### <a name="5">3. 返回码说明</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

| 返回码      | 说明                                                   |
| ----------- | ------------------------------------------------------ |
| -1          | 系统繁忙                                               |
| -2          | 系统内部异常                                           |
| 0           | 请求成功                                               |
| 20002       | 参数异常                                               |
| 20003       | 请求异常                                               |
| 30001       | 超过日发送数量限制                                     |
| 30002       | 超过月发送数量限制                                     |
| 30003       | 超过每秒 发送数量限制                                  |
| 30004       | 超过年发送数量限制                                     |
| 30006       | 回调接口验证失败                                       |
| 30007       | 审核结果通知发送失败                                   |
| 30008       | chatbotId 与 senderAddress 不匹配                      |
| 40001       | 获取 accessToken 时 appKey 错误，或者 accessToken 无效 |
| 40002       | 不合法的凭证类型                                       |
| 40005       | 不合法的文件类型                                       |
| 40006       | 不合法的文件大小                                       |
| 40007       | 不合法的媒体素材 url                                   |
| 40008       | 不合法的消息类型                                       |
| 40011       | Chatbot 消息跟新失败                                   |
| 40014       | 不合法的 accessToken                                   |
| 40016       | 不合法的按钮个数                                       |
| 40017       | 不合法的按钮类型                                       |
| 40018       | 不合法的按钮名字长度                                   |
| 40019       | 不合法的按钮 KEY 长度                                  |
| 40020       | 不合法的按钮 URL 长度                                  |
| 40021       | 不合法的文本长度                                       |
| 40022       | 临时文件已过期                                         |
| 40040       | 文件数量长处限制                                       |
| 40052       | 不合法的按钮链接                                       |
| 41001       | 缺少 accessToken 参数                                  |
| 41002       | 缺少 appId 参数                                        |
| 41004       | 缺少 appKey 参数                                       |
| 41005       | 缺少多媒体文件数据                                     |
| 41006       | 缺少素材 url 参数                                      |
| 42001       | accessToken 超时                                       |
| 43001       | 需要GET请求                                            |
| 44001       | 多媒体文件为空                                         |
| 44002       | POST 的数据包为空                                      |
| 45001       | 接口调用超过限制                                       |
| 45010       | 回复时间超过限制                                       |
| 46001       | 不存在的用户                                           |
| 46002       | 临时用户不存在                                         |
| 46003       | 用户已被限制                                           |
| 47001       | 解析 JSON/XML 内容错误                                 |
| 47002       | 解析子菜单 JSON/XML 内容错误                           |
| 48001       | api 功能未授权                                         |
| 60001       | 不合法的内容                                           |
| 60002       | 需要订阅关系                                           |
| 60003       | 无效的消息类型                                         |
| 70001       | 消息体被管控                                           |
| 81000~83999 | 中国电信个性返回码                                     |
| 87000~89999 | 中国联通个性返回码                                     |

### <a name="6">4. 接口频率限制说明</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

| 接口             | 每日限额 |
| ---------------- | -------- |
| 获取 accessToken | 2000     |
| 验收消息真实性   | 无上限   |
| 接收普通消息     | 无上限   |
| 接收时间推送     | 无上限   |
| 发送被动响应消息 | 无上限   |
| 发送主动客服消息 | 无上限   |

## <a name="7">三、基础能力接口</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

### <a name="8">1. 获取 accessToken</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** Chatbot→5G 消息业务平台 

- **请求方法：**`HTTPS POST `

- **请求URL**：**https://{serverRoot}/bot/{apiVersion}/{chatbotId}/accessToken**

- **接口说明：** accessToken是Chatbot帐号的全局唯一票据，Chatbot账号调用各接口时都需使用 accessToken。正常情况accessToken有效期为7200秒，重复获取将导致上次获取的 accessToken失效。由于获取accessToken的api调用次数非常有限，建议Chatbot全局存储与更 新accessToken，频繁刷新accessToken会导致api调用受限，影响自身业务。 Chatbot账号可以使用appId和appkey调用本接口来获取accessToken。appId和appkey可在 开发模式中获得。注意调用所有5G消息业务平台接口时均需使用https协议。 Chatbot首次获取accessToken成功，则认为Chatbot接入成功，Chatbot接入后，平台需要 进行回调url的验证，验证通过才认为该Chatbot已启用，为可用状态，否则该Chatbot不可用。

- **请求体**

  | 序号 | 字段   | 数据类型 | 可选属性 | 描述                      |
  | ---- | ------ | -------- | -------- | ------------------------- |
  | 1    | appId  | string   | 必选     | 第三方chatbot唯一凭证     |
  | 2    | appKey | string   | 必选     | 第三方chatbot唯一凭证密钥 |

  示例

  ```json
  { 
      "appId": "xxxxxxxx", 
      "appKey": "xxxxxxx" 
  }
  ```

- **返回体**

  | 序号 | 字段         | 数据类型 | 可选属性 | 描述                                        |
  | ---- | ------------ | -------- | -------- | ------------------------------------------- |
  | 1    | accessToken  | string   | 必选     | 获取到的凭证                                |
  | 2    | expires      | int      | 必选     | 凭证有效时间，单位：秒                      |
  | 3    | url          | string   | 必选     | 后续使用接口时调用的服务器地址              |
  | 4    | errorCode    | int      | 必选     | 状态码，0：成功<br />其它状态参见返回码说明 |
  | 5    | errorMessage | string   | 可选     | 错误描述                                    |

  示例

  ```json
  // 正确响应
  { 
      "accessToken": "xxxxxxxx", 
      "expires": 7200, 
      "errorCode":0, 
      "url": "xxxxxx" 
  }
  
  // 错误响应
  { 
      "errorCode": 40013, 
      "errorMessage": "not match rule" 
  }
  ```

### <a name="9">2. 身份鉴权</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** 5G 消息业务平台 → Chatbot

- **请求方法：** `HTTPS GET` 

- **请求 URL：https://{notifyURL}/notifyPath** 

- **接口说明：** 在Chatbot首次接入时，由平台分配或Chatbot指定随机码token，服务器将发送GET请求 到Chatbot填写的消息接收URL上，并且在请求消息中带上4个参数（signature、timestamp 、 nonce、echoStr），Chatbot须通过对签名（即signature）的效验，来判断此条消息的真实性。

  > **加密/校验流程如下**： 
  >
  > 1、将token、timestamp 、nonce三个参数内容进行字典顺序排序。 
  >
  > 2、将排序后三个参数字符串拼接成字符串并进行sha256摘要加密。 
  >
  > 3、将加密后的字符串与请求消息中的signature对比，判断请求消息来源是否合法。

- **请求头：**

  | 序号 | 字段      | 数据类型 | 可选属性 | 描述                                      |
  | ---- | --------- | -------- | -------- | ----------------------------------------- |
  | 1    | signature | string   | 必选     | 根据加密流程生成的签名                    |
  | 2    | timestamp | long     | 必选     | Linux时间戳，即1970年1月1日以来经过的秒数 |
  | 3    | nonce     | string   | 必选     | 采用UUID算法生成                          |
  | 4    | echoStr   | string   | 可选     | 随机字符串，验证Chatbot消息接收url使用    |
  | 5    | chatbotId | string   | 必选     | ChatbotId                                 |

  > Chatbot首次接入或更换消息接收url时，平台将对消息接收url进行有效性验证，验证通 过则认为该Chatbot为可用状态，否则该Chatbot不可用。
  >
  > Chatbot通过检验signature对请求进 行校验，若Chatbot确认此次请求来自5G消息业务平台服务器，则原样返回请求消息中的 echoStr随机字符串和appId，平台校验是否属实，若平台校验成功，则接入成功，证明url为 有效的url，否则接入失败。 
  >
  > 后续推送消息时，平台将在请求http头域附加signature、timestamp、nonce参数，若确认 此次请求来自5G消息业务平台服务器，则请求有效。

- **响应头：**

  | 序号 | 字段    | 数据类型 | 可选属性 | 描述                                   |
  | ---- | ------- | -------- | -------- | -------------------------------------- |
  | 1    | echoStr | string   | 必选     | 随机字符串，验证Chatbot消息接收url使用 |
  | 2    | appId   | string   | 必选     | 第三方chatbot唯一凭证                  |

## <a name="10">四、Chatbot 信息管理</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> Chatbot选填信息指终端展示的Chatbot信息里面的非必填内容，Chatbot可根据自身情况， 填写和更新信息
>
> Chatbot填写的选填信息每次更新后须经平台审核通过才可使用。

### <a name="11">1. Chatbot 基本信息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向**：Chatbot →5G 消息业务平台 

- **请求方法：** `HTTPS POST` 

- **请求 URL：https://{serverRoot}/bot/{apiVersion}/{chatbotId}/update/chatBotInfo/optionals**

- **接口说明**： 可根据Chatbot自身情况，更新Chatbot的选填基本信息，并通过接口将信息传递给平台， 平台审核通过后，信息生效，可供终端查看

- **请求体：**

  | 序号 | 字段               | 数据类型 | 长度  | 可选属性 | 描述                                                         |
  | ---- | ------------------ | -------- | ----- | -------- | ------------------------------------------------------------ |
  | 1    | serviceDescription | string   | 500   | 可选     | 服务描述:用于解释Chatbot的用 途，最多500个字符               |
  | 2    | category           | Object   | 50*15 | 可选     | 机器人分类，每种分类最长 50 字节。需要携带多个分类时，应 携带多个 category 参数。 最多可携带15个category参数。 （本期暂时只可携带1种分类） |
  | 3    | callBackNumber     | string   | 21    | 可选     | 回拨号码：用于终端用户直接回 拨给 Chatbot 方的电话号码；     |
  | 4    | provider           | string   | 100   | 可选     | 机器人提供者信息                                             |
  | 5    | longitude          | double   | 8     | 可选     | 地理位置经度                                                 |
  | 6    | latitude           | double   | 8     | 可选     | 地理位置纬度                                                 |
  | 7    | themeColour        | string   | 20    | 可选     | 主题颜色：用聊天机器人的用户 的对话视图中应用的主题颜色 （例如，消息气泡和对话标题的 颜色）；填写具体的 RGB 值,如 黑色为：#000000 |
  | 8    | serviceWebsite     | string   | 150   | 可选     | 服务网站：Chatbot 服务方的网站 信息                          |
  | 9    | emailAddress       | string   | 50    | 可选     | 电子邮件：Chatbot 服务方的电子 邮件                          |
  | 10   | backgroundImage    | string   | 150   | 可选     | 应用于聊天机器人信息页面的 背景图像                          |
  | 11   | address            | string   | 200   | 可选     | 营业地址                                                     |
  | 12   | cssStyle           | string   | 150   | 可选     | 指向 Chatbot 富媒体卡片的通用 CSS 文件的 URL。               |
  | 13   | autograph          | string   | 50    | 可选     | 用于消息回落短信时的签名                                     |

  示例：

  ~~~json
  { 
      "callBackNumber": "12345678912", 
      "themeColour": "#000000", 
      "serviceWebsite": "https://xxx.com", 
      "emailAddress": "example@test.com", 
      "backgroundImage": "https://xxxx/xx.png" 
  }
  ~~~

  

- **返回体：**

  | 序号 | 字段         | 数据类型 | 可选属性 | 描述                                        |
  | ---- | ------------ | -------- | -------- | ------------------------------------------- |
  | 1    | errorCode    | int      | 必选     | 状态码，0：成功<br />其它状态参见返回码说明 |
  | 2    | errorMessage | string   | 可选     | 错误描述                                    |

  示例：

  ~~~json
  { 
      "errorCode": 0, 
      "errorMessage": "success" 
  }
  ~~~

### <a name="12">2. Chatbot 固定菜单</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** Chatbot → 5G 消息业务平台 
- **请求方法：** `HTTPS POST` 
- **请求 URL：https://{serverRoot}/bot/{apiVersion}/{chatbotId}/update/chatBotInfo/menu** 

- **接口说明：** 可对Chatbot指定一个永久的固定菜单，作为Chatbot信息的一部分，未进行消息交互时 能为终端提供建议操作和建议回复。固定菜单最多2级，其中1级菜单最多3个条目，2级菜单 最多5个条目，每个条目可为下一级菜单、建议操作或建议回复。

  > 其中建议回复由一个显示文本和一组回发数据组成；建议操作总共分为 9种操作： 
  >
  > - openUrl：通过深度链接打开网站（也可用于打开设备上的另一个APP）； 
  > - dialPhoneNumber：通过用户的拨号应用程序向特定对象拨打电话（通话号码由 Chatbot预填）； 
  > - dialVideoCall：通过用户的拨号应用程序向特定用户启动视频通话（通话号码由 Chatbot预填）； 
  > - showLocation：打开用户的默认地图APP，定位到特定位置（通过经纬度或地图上搜索确定位置点）； 
  > - requestLocationPush：请求用户向Chatbot发送一次地理位置推送； 
  > - createCalendarEvent：在用户日历上创建新事件，并预填好开始时间、结束时间、 标题、描述等； 
  > - composeTextMessage：终端向特定对象发送文本消息（发送号码和消息内容由Chatbot预先填好）； 
  > - composeRecordingMessage：终端录制音视频并发送给特定对象（发送号码由Chatbot预先填好）； 
  > - requestDeviceSpecifics：请求终端一次性共享设备信息（设备型号、操作系统版本、 消息客户端标识符和版本，以及剩余的电池电量（分钟）；

- **请求体：**

  <img src="https://fabian.oss-cn-hangzhou.aliyuncs.com/img/image-20211116103710503.png" alt="image-20211116103710503" style="zoom:50%;" />

  示例：

  ~~~json
  { 
      "menu": { 
          "entries": [ 
              { 
                  "reply": { 
                      "displayText": "reply1", 
                      "postback": { 
                          "data": "set_by_chatbot_reply1" 
                      } 
                  } 
              }, { 
                  "menu": { 
                      "displayText": "SubmenuL1", 
                      "entries": [ { 
                          "reply": { 
                              "displayText": "reply2", 
                              "postback": { 
                                  "data": "set_by_chatbot_reply2" 
                              } 
                          } 
                      }, { 
                          "action": { 
                              "dialerAction": { 
                                  "dialPhoneNumber": { 
                                      "phoneNumber": "+8617928222350" 
                                  } 
                              }, 
                              "displayText": "Call a phone number", 
                              "postback": { 
                                  "data": "set_by_chatbot_dial_menu_phone_number" 
                              } 
                          } 
                      } 
                                 ] 
                  }
              } 
          ] 
      } 
  }
  ~~~

### <a name="13">3. Chatbot 信息获取</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** Chatbot → 5G 消息业务平台 

- **请求方法：** `HTTPS GET`

- **请求 URL：https://{serverRoot}/bot/{apiVersion}/{chatbotId}/find/chatBotInfo** 

- **接口说明：**  Chatbot的必填信息由平台维护，Chatbot的选填信息由接口API维护，选填信息审核通过 后， 可从平台获取所有信息（包含固定菜单）。

- **返回参数：**

  | 序号 | 字段               | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ------------------ | -------- | -------- | ------------------------------------------------------------ |
  | 1    | accessNo           | string   | 必选     | Chatbot ID 中的接入号部分，新增时必 填，唯一 不能修改。      |
  | 2    | domain             | string   | 必选     | Chatbot ID 中的域名部分。不能修改。                          |
  | 3    | serviceName        | string   | 必选     | 服务名称：一个字母数字的服务名称， 用于标识会话列表和会话内的聊天机 器人 |
  | 4    | serviceIcon        | string   | 必选     | 服务图标：非动画缩略图作为服务图 标，用于标识会话列表和会话内的聊天 机器人 |
  | 5    | TCPage             | string   | 必选     | 终端显示 Chatbot 的认证条款和条件 （Terms & Conditions）：链接到 Chatbot 特定条款和条件，该链接的网页包含服 务条款信息； |
  | 6    | SMSNumber          | string   | 必选     | SMS 号码：Chatbot 的短消息号码                               |
  | 7    | verified           | bool     | 必选     | Chatbot 的认证状态：<br />false：未认证，默认 <br />true：已认证 |
  | 8    | authName           | string   | 必选     | 认证主体名，verified 为 true 时值非空。                      |
  | 9    | authExpires        | string   | 必选     | 认证有效期，verified为true时值非空。 例：2020-04-04T23:59:00Z |
  | 10   | authOrg            | string   | 必选     | 认证机构，verified 为 true 时值非空。                        |
  | 11   | status             | int      | 必选     | Chatbot 状态： <br />0 ：正常 <br />1 ：调试<br /> 2 ：暂停  |
  | 12   | criticalChatbot    | bool     | 必选     | 特殊 Chatbot（Critical Chatbot）：用以 标识 Chatbot 是否为应急 Chatbot <br />false：非应急 Chatbot，默认 <br />true：是应急 Chatbot |
  | 13   | url                | string   | 必选     | Chatbot 回调地址： 用于 Chatbot 接收消息                     |
  | 14   | version            | int      | 必选     | 机器人版本号，默认是2                                        |
  | 15   | provider           | string   | 必选     | 机器人提供者信息                                             |
  | 16   | category           | object   | 必选     | 机器人分类，每种分类最长 50 字节。 需要携带多个分类时，应携带多个 category 参数。 最多可携带15个category参数。（本期 只可携带1种分类） |
  | 17   | serviceDescription | string   | 必选     | 服务描述:以解释Chatbot的用途，最多 500个字符                 |
  | 18   | longitude          | double   | 必选     | 地理位置经度                                                 |
  | 19   | latitude           | double   | 必选     | 地理位置纬度                                                 |
  | 20   | callBackNumber     | string   | 必选     | M 回拨号码：用于终端用户直接回拨给 Chatbot 方的电话号码；    |
  | 21   | themeColour        | string   | 必选     | 主题颜色：用聊天机器人的用户的对话 视图中应用的主题颜色（例如，消息气 泡和对话标题的颜色）；填写具体的 RGB 值,如黑色为：#000000 |
  | 22   | serviceWebsite     | string   | 必选     | 服务网站：Chatbot 服务方的网站信息；                         |
  | 23   | emailAddress       | string   | 必选     | 电子邮件：Chatbot 服务方的电子邮件；                         |
  | 24   | backgroundImage    | string   | 必选     | 背景图片：应用于聊天机器人信息页面 的背景图像的 URL 地址；   |
  | 25   | address            | string   | 必选     | 地址（Address）：例如营业地址；                              |
  | 26   | menu               | object   | 必选     | 固定菜单的 json 体，如果没有设置，则为空                     |
  | 27   | cssStyle           | string   | 必选     | 指向 Chatbot 富媒体卡片的通用 CSS 文件的 URL。               |

  示例：

  ~~~json
  { 
      "accessNo": "10690000", 
      "domain": "botplatform.rcs.domain.cn", 
      "serviceName": "xxxx", 
      "serviceIcon": "https://xxxx/icon.png", 
      "TCPage": "https://xxxx.com/",
      "SMSNumber": "10690000",
      "verified": false, 
      "authName": "", 
      "authExpires": "", 
      "authOrg": "", 
      "status": 2, 
      "criticalChatbot": false, 
      "url": "https://xxxx.com/", 
      "version": 2, 
      "provider": "xxxx", 
      "category": [ 
          "education" 
      ],
      "serviceDescription": "", 
      "longitude": 50.7311865, 
      "latitude": 7.0914591, 
      "callBackNumber": "12345678912", 
      "themeColour": "#000000", 
      "serviceWebsite": "https://xxx.com", 
      "emailAddress": "example@test.com", 
      "backgroundImage": "https://xxxx/xx.png", 
      "address": "", 
      "menu": {}, 
      "cssStyle": "" 
  }
  ~~~

## <a name="14">五、媒体素材管理</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> Chatbot在发送消息时，对多媒体文件的获取和调用等操作，是通过url来进行的。
>
> 通过本接口，可以上传、下载和删除多媒体文件。文件上传后，平台返回媒体素材url。
>
>  媒体素材分为永久素材和临时素材，永久素材上传后可长期存储，且须经审核后才可使用，永久素材的存储量平台采用一定的限额，超出限额后需先删除后上传，实际限额参照运营规定。
>
> 临时素材在平台的存储有效期为N天，临时素材的实际限额和有效期参照运营规定。 
>
> Chatbot下发消息时，消息里面的媒体内容须引用已上传的媒体素材。

### <a name="15">1. 媒体素材上传</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** Chatbot→5G 消息业务平台

- **请求方法：** `HTTPS POST` 

  **请求 URL：https://{serverRoot}/bot/{apiVersion}/{chatbotId}/medias/upload**

- **接口说明：** Chatbot可调用本接口将图片、音频、视频等文件提前上传到5G消息业务平台。支持发送图片、音频、视频素材和缩略图。文件大小要求如下： 

  - 图片（image）: 2M，支持JPG/JPEG、PNG格式； 
  - 音频（audio）：5M，播放时长不超过90s，AMR、MP3、M4A格式； 
  - 视频（video）：10M，播放时长不超过60s，MP4、WEBM格式； 
  - 缩略图（thumbnail）：200KB，支持JPG/JPEG、PNG格式。

- **请求头字段：**

  | 序号 | 字段           | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | -------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | authorization  | string   | 必选     | 调用接口凭证<br />例：accessToken TXlwdndOZG0yWTpjUml0dHMzM1dKRnBXRUdD |
  | 2    | uploadMode     | string   | 必选     | perm:永久文件 <br />temp:临时文件                            |
  | 3    | content-type   | string   | 必选     | multipart/form-data                                          |
  | 4    | accept         | string   | 必选     | 接受的数据类型类型，本协议取值<br /> application/json        |
  | 5    | host           | string   | 必选     | 请求服务器的域名/IP地址和端口号                              |
  | 6    | date           | string   | 必选     | 消息时间戳，默认标准Gmt表达方式 <br />例如：Date: Tue, 15 Nov 2019 08:12:31 GMT |
  | 7    | content-length | long     | 可选     | 内容长度                                                     |

- **请求体：**

  | 数据类型 | 可选属性 | 描述              |
  | -------- | -------- | ----------------- |
  | Binary   | 必选     | multipart文件内容 |

  示例：

  ~~~http
  POST /exampleAPI/bot/v1/sip%3A106500%40botplatform.rcs.domain.cn/medias/upload HTTP/1.1 
  content-type: multipart/form-data; boundary=TGvFHJKLZeghjkk 
  accept: application/json 
  host: example.com 
  authorization: accessToken TXlwdndOZG0yWTpjUml0dHMzM1dKRnBXRUdD 
  date: Tue, 15 Nov 2019 08:12:31 GMT 
  uploadMode: temp 
  content-length: nnnn 
  
  Binary File Body
  ~~~

- **响应体：**

  | 序号 | 字段         | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ------------ | -------- | -------- | ------------------------------------------------------------ |
  | 1    | fileInfo     | array    | 必选     | 文件信息对象数组，对象说明如下                               |
  | 2    | fileCount    | int      | 可选     | 已经上传素材数量<br />请求中UploadMode为perm 时，返回永久素材数量；<br />UploadMode为temp时， 返回临时素材数量 |
  | 3    | totalCount   | int      | 可选     | 允许上传素材总数量<br />请求中UploadMode为perm 时，返回永久素材数量；<br />UploadMode为temp时， 返回临时素材数量 |
  | 4    | errorCode    | int      | 必选     | 状态码，0：成功<br />其它状态参见返回码说明                  |
  | 5    | errorMessage | string   | 可选     | 错误描述                                                     |

- **fileInfo 对象格式说明：**

  | 序号 | 字段              | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ----------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | url               | string   | 必选     | 文件URL，例如： http://124.127.121.100/temp/src/2020062217asdfkjaoskd/836ee/view/37,3c3504f6e4cc6c5274f0.mp4 |
  | 2    | fileName          | string   | 必选     | 文件名称                                                     |
  | 3    | contentType       | string   | 必选     | 文件类型，如image/jpg、video/mp4等                           |
  | 4    | fileSize          | long     | 必选     | 文件大小                                                     |
  | 5    | until             | string   | 可选     | 文件有效期，如果上传临时素材会带此参数，永久素材无有效期     |
  | 6    | fileHashAlgorithm | string   | 可选     | 文件Hash算法                                                 |
  | 7    | fileHashValue     | string   | 可选     | 文件Hash值                                                   |

  示例：

  ~~~json
  // 临时素材
  { 
      "fileInfo": [ 
          { 
              "url": 	"http://xxxxx4cc6c5274f0.jpg",
           	"fileName": "AA.jpg", 
           	"contentType": "image/jpg", 
           	"fileSize": 22347, 
           	"until": "2017-04-25T12:17:07Z" 
          } 
      ],
      "fileCount": 100, 
      "totalCount": 300,
      "errorCode": 0 
  }
  
  // 永久素材
  { 
      "fileInfo": [ 
          { 
              "url": "http://xxxx04f6e4cc6c5274f0. jpg", 
              "fileName": "AA.jpg", 
              "contentType": "image/jpg", 
              "fileSize": 22347 
          } 
      ],
      "fileCount": 100, 
      "totalCount": 200, 
      "errorCode": 0 
  }
  ~~~

### <a name="16">2. 媒体素材下载</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** Chatbot→5G 消息业务平台 

- **请求方法：** `HTTPS GET`

- **请求 URL：https://{serverRoot}/bot/{apiVersion}/{chatbotId}/medias/download** 

- **接口说明：** Chatbot可调用本接口来获取已经上传和用户回复内容中的多媒体文件。**请注意：** 视频 文件不支持下载，通过接口获取到的是视频播放地址，可支持在线流媒体播放。

- **请求头：**

  | 序号 | 字段          | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | authorization | string   | 必选     | 调用接口凭证<br />例：accessToken TXlwdndOZG0yWTpjUml0dHMzM1dKRnBXRUdD |
  | 2    | url           | string   | 必选     | 文件URL                                                      |
  | 3    | range         | string   | 可选     | 下载文件范围 断点续传时必须填写此参数                        |
  | 4    | host          | string   | 必选     | 请求服务器的域名/IP地址和端口号                              |
  | 5    | date          | string   | 必选     | 消息时间戳，默认标准Gmt表达方式 <br />例如：Date: Tue, 15 Nov 2019 08:12:31 GMT |

  正确返回示例：

  ~~~http
  HTTPS/1.1 200 OK 
  connection: close 
  content-Type: image/jpeg 
  content-disposition: attachment; filename="MEDIA_ID.jpg" 
  date: Tue, 15 Nov 2019 08:12:31 GMT 
  cache-control: no-cache, must-revalidate 
  content-range: bytes 0-123455/123456 
  content-length: nnnn 
  
  Binary File Body
  ~~~

### <a name="17">3. 媒体素材删除</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** Chatbot→5G 消息业务平台 

- **请求方法：** `HTTPS DELETE` 

- **请求 URL： https://{serverRoot}/bot/{apiVersion}/{chatbotId}/medias/delete**

- **接口说明：** 在新增了素材后，Chatbot可以根据本接口的需求来删除不再需要的素材，节省空间。 媒体素材已经删除则不可恢复。 请注意：1、请谨慎操作本接口；2、调用该接口需https协议。

- **请求头：**

  | 序号 | 字段          | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | authorization | string   | 必选     | 调用接口凭证<br />例：accessToken TXlwdndOZG0yWTpjUml0dHMzM1dKRnBXRUdD |
  | 2    | url           | string   | 必选     | 文件URL                                                      |
  | 3    | host          | string   | 必选     | 请求服务器的域名/IP地址和端口号                              |
  | 4    | date          | string   | 必选     | 消息时间戳，默认标准Gmt表达方式 <br />例如：Date: Tue, 15 Nov 2019 08:12:31 GMT |

- **响应体：**

  | 序号 | 字段         | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ------------ | -------- | -------- | ------------------------------------------------------------ |
  | 1    | deleteMode   | string   | 必选     | perm:永久文件 <br />temp:临时文件                            |
  | 2    | fileCount    | int      | 可选     | 已经上传素材数量<br />删除的文件为永久素 材时，返回永久素材数量；<br />删除的文件为 临时素材时，返回临时素材数量 |
  | 3    | totalCount   | int      | 可选     | 允许上传素材总数量<br />删除的文件为永久 素材时，返回永久素材数量；<br />删除的文件 为临时素材时，返回临时素材数量 |
  | 4    | errorCode    | int      | 必选     | 状态码，0：成功<br />其它状态参见返回码说明                  |
  | 5    | errorMessage | string   | 可选     | 错误描述                                                     |

  示例：

  ~~~json
  { 
      "deleteMode": "perm", 
      "fileCount": 20, 
      "totalCount": 100, 
      "errorCode": 0, 
      "errorMessage": "success" 
  }
  ~~~

## <a name="18">六、Chatbot 发送消息（消息单发）</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向**：Chatbot → 5G 消息业务平台 

- **请求方法：** `HTTPS POST` 

- **请求 URL：https://{serverRoot}/bot/{apiVersion}/{chatbotId}/messages**

- **接口说明：** 接口满足Chatbot进行消息下发的需求，一阶段只支持消息单发，不支持消息群发。Chatbot进行消息下发时，须预先设置是否允许消息回落和离线存储。允许消息回落则必须预设回落内容。当终端非5G消息终端，且预设不允许消息回落时， 消息发送失败；预设允许消息回落但未预设消息回落内容时，消息自动回落。当终端5G消息功能离线时，优先选择离线存储功能，若预设离线存储，则消息存储在网络侧，待终端5G消息功能上线后进行下发。若未预设离线存储，则实行回落策略。消息发送过程中平台通过敏感词库对消息的文本内容进行实时监控，监控过程中若发现不合规内容，则截断消息发送。 终端和Chatbot进行消息交互时，消息内容将存储在内容服务器中，存储期限暂定为7天，后续存储期限将基于信息安全监管规定动态调整

- **请求体：**

  | 序号 | 字段               | 数据类型     | 可选属性 | 描述                                                         |
  | ---- | ------------------ | ------------ | -------- | ------------------------------------------------------------ |
  | 1    | messageId          | string       | 必选     | 消息ID                                                       |
  | 2    | messageList        | array        | 必选     | 消息内容结构体，具体参数说明见下                             |
  | 3    | destinationAddress | array        | 必选     | 用户URI list， tel格式                                       |
  | 4    | senderAddress      | string       | 必选     | 发送方地址From，群发时填写Chatbot 的URI，广播时填写Chatbot的URI（暂不提供） |
  | 5    | conversationId     | string       | 必选     | 唯一标识主被叫用户间的一个聊天对话                           |
  | 6    | contributionId     | string       | 必选     | 唯一标识一个聊天会话                                         |
  | 7    | serviceCapability  | object array | 必选     | 业务能力，Chatbot版本号 说明见下                             |
  | 8    | trafficType        | string       | 可选     | 流量类型，可取值为<br />advertisement<br />payment <br />premium <br />subscription <br />token（token可用于类型扩展） |
  | 9    | smsSupported       | bool         | 必选     | 是否转短信：<br />false:不转，默认<br />true:转              |
  | 10   | imFormat           | string       | 可选     | IM 消息格式 ，可选值包括 IM 、 LargerMode、PagerMode，默认值为IM |
  | 11   | inReplyTo          | string       | 可选     | 该标识是对另一条消息的回复，值是一 条上行消息的contributionId。 |
  | 12   | reportRequest      | array        | 可选     | 状态事件报告列表，每个状态事件的可选值为: <br />消息状态主要有如下几种状态： <br />sent：消息已发送 <br />failed：消息发送失败 <br />delivered：消息已送达 <br />displayed：消息已阅读 <br />deliveredToNetwork：已转短消息已送达 |
  | 13   | storeSupported     | bool         | 必选     | 是否离线存储： <br />false：不存也不重试<br />true：存，默认 |
  | 14   | smsContent         | string       | 可选     | smsContent为消息回落时的消息内容<br />smsSupported为true时，本字段有效且不 能为空。 |

- **serviceCapability关键字段：**

  | 序号 | 字段         | 数据类型 | 可选属性 | 描述                                     |
  | ---- | ------------ | -------- | -------- | ---------------------------------------- |
  | 1    | capabilityId | string   | 必选     | 值为 ChatbotSA                           |
  | 2    | version      | string   | 必选     | 版本号，如+g.gsma.rcs.botversion=\"#=1\" |

- **messageList 内容的结构体：**

  | 序号 | 字段            | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | --------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | contentType     | string   | 必选     | 混合消息（multipart/mixed）中，其中一个消息的类型，取值如下： <br />text/plain：文本消息/地理位置回落消息 <br />application/vnd.gsma.rcs-ft-http：文件消息 <br />application/vnd.gsma.botmessage.v1.0+json： 富媒体卡片消息 <br />application/vnd.gsma.botsuggestion.v1.0+jso n：Suggested Chip List带建议回复列表的消息 |
  | 2    | contentEncoding | string   | 可选     | 消息内容(contentText)编码方式。 <br />默认为utf8字符编码,可选base64编码。 |
  | 3    | contentText     | object   | 必选     | contentEncoding为base64时，内容编码后的 base64 字符串。<br />contentType为"text/plain"时，内容为字符串 <br />contentType为其他的类型时，内容为json对 象 |

- **返回体：**

  | 序号 | 字段           | 数据类型 | 可选属性 | 描述                                        |
  | ---- | -------------- | -------- | -------- | ------------------------------------------- |
  | 1    | messageId      | array    | 必选     | 消息ID                                      |
  | 2    | conversationId | int      | 可选     | 唯一标识主被叫用户间的一个聊天对话          |
  | 3    | contributionId | int      | 可选     | 唯一标识一个聊天会话                        |
  | 4    | errorCode      | int      | 必选     | 状态码，0：成功<br />其它状态参见返回码说明 |
  | 5    | errorMessage   | string   | 可选     | 错误描述                                    |

### <a name="19">1. 文本消息 + 消息回落</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> 纯文本消息最多可配置的字数长度为2000字。

示例：

~~~json
{ 
    "messageId": "cb1188a3-37ec-1037-9054-2dc66e44375b", 
    "messageList": [ 
        { 
            "contentType": "text/plain", 
            "contentEncoding": "utf8", 
            "contentText": "hello world" 
        } 
    ],
    "destinationAddress": [ 
        "tel:+8617928222350" 
    ],
    "senderAddress": "sip:106500@botplatform.rcs.domain.cn", 
    "smsSupported": true, 
    "storeSupported": false, 
    "smsContent": "hello world!", 
    "serviceCapability": [ 
        { 
            "capabilityId": "ChatbotSA", 
            "version": "+g.gsma.rcs.botversion=\"#=1\"" 
        } 
    ],
    "conversationId": "XSFDSFDFSAFDSAS^%", 
    "contributionId": "SFF$#REGFY7&^%THT" 
}
~~~

### <a name="20">2. 文本消息 + 悬浮菜单</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> 文本消息最多可配置的字数长度为2000字。位于悬浮菜单的建议操作和建议回复按钮总数量不超过11个。每个建议操作和每个建议回复的展示文字（Display Text）最多为25个字符（Byte）。

示例：

~~~json
{ 
    "messageId": "cb1188a3-37ec-1037-9054-2dc66e44375b", 
    "messageList": [ 
        { 
            "contentType": "text/plain", 
            "contentText": "hello world" 
        }, { 
            "contentType": "application/vnd.gsma.botsuggestion.v1.0+json", 
            "contentText": { 
                "suggestions": [ { 
                    "reply": { 
                        "displayText": "Yes", 
                        "postback": { 
                            "data": "set_by_chatbot_reply_yes"
                        } 
                    } 
                }, { 
                    "reply": { 
                        "displayText": "No", 
                        "postback": { 
                            "data": "set_by_chatbot_reply_no" 
                        } 
                    } 
                }, { 
                    "action": { 
                        "urlAction": { 
                            "openUrl": { 
                                "url": "https://www.10010.com" 
                            } 
                        }, 
                        "displayText": "Open website or deep link", 
                        "postback": { 
                            "data": "set_by_chatbot_open_url" 
                        } 
                    } 
                }, { 
                    "action": { 
                        "dialerAction": { 
                            "dialPhoneNumber": { 
                                "phoneNumber": "+8617928222350" 
                            } 
                        }, 
                        "displayText": "Call a phone number", 
                        "postback": { 
                            "data": "set_by_chatbot_open_dialer" 
                        } 
                    } 
                } 
                               ] 
            } 
        } 
    ],
    "destinationAddress": [ 
        "tel:+8617928222350" 
    ],
    "smsSupported": false, 
    "storeSupported": false, 
    "senderAddress": "sip:106500@botplatform.rcs.domain.cn", 
    "serviceCapability": [ 
        { 
            "capabilityId": "ChatbotSA", 
            "version": "+g.gsma.rcs.botversion=\"#=1\"" 
        } 
    ],
    "conversationId": "XSFDSFDFSAFDSAS^%", 
    "contributionId": "SFF$#REGFY7&^%THT" 
}
~~~

### <a name="21">3. 文件消息 </a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> ​		文件消息中，最多可以携带2个文件。当消息内容中携带2个文件时，其中一个文件为缩略图，一个文件为发送给用户的原文件，缩略图必须为不大于200K的图片文件。 
>
> ​		文件消息体中，type主要用于指定原文件和缩略图，可用值包括："file" 和 "thumbnail" 两种。实际发送过程中，fileSize、contentType、until为可选字段。 

示例：

~~~json
{ 
    "messageId": "cb1188a3-37ec-1037-9054-2dc66e44375b", 
    "messageList": [ 
        { 
            "contentType": "application/vnd.gsma.rcs-ft-http", 
            "contentEncoding": "utf8", 
            "contentText": [ 
                { 
                    "type": "thumbnail", 
                    "fileSize": 7427, 
                    "contentType": "image/jpg", 
                    "url": "http://xxxxx74f0. jpg", 
                    "until": "2019-04-25T12:17:07Z"
                }, { 
                    "type": "file", 
                    "fileSize": 183524, 
                    "fileName": "DSC_379395051.JPG", 
                    "contentType": "image/jpg", 
                    "url": "http://xxxxxx6c5274f0. jpg", 
                    "until": "2019-04-25T12:17:07Z" 
                } 
            ] 
        } 
    ],
    "destinationAddress": [ 
        "tel:+8617928222350" 
    ],
    "smsSupported": false, 
    "storeSupported": false, 
    "senderAddress": "sip:106500@botplatform.rcs.domain.cn", 
    "serviceCapability": [ 
        { 
            "capabilityId": "ChatbotSA", 
            "version": "+g.gsma.rcs.botversion=\"#=1\"" 
        } 
    ],
    "conversationId": "XSFDSFDFSAFDSAS^%", 
    "contributionId": "SFF$#REGFY7&^%THT" 
}
~~~

### <a name="22">4. 地理位置回落消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

示例：

~~~json
{ 
    "messageId": "cb1188a3-37ec-1037-9054-2dc66e44375b",
    "messageList": [ 
        { 
            "contentType": "text/plain", 
            "contentText": "geo:50.7311865,7.0914591;crs=gcj02;u=10;rcs-l=Qingfeng%20Steamed%20Dumpling%20Shop %20%F0%9F%8D%9A" 
        } 
    ],
    "destinationAddress": [ 
        "tel:+8617928222350" 
    ],"smsSupported": false, 
    "storeSupported": false, 
    "senderAddress": "sip:106500@botplatform.rcs.domain.cn", 
    "serviceCapability": [ 
        { 
            "capabilityId": "ChatbotSA", 
            "version": "+g.gsma.rcs.botversion=\"#=1\"" 
        } 
    ],
    "conversationId": "XSFDSFDFSAFDSAS^%", 
    "contributionId": "SFF$#REGFY7&^%THT" 
}
~~~

### <a name="23">5. 富媒体卡片消息(带 CSS 样式) + Suggestions </a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> ​		每条消息卡片标题字数不超过200字，描述内容不超过2000字。每张卡片内建议操作和 建议回复按钮总数量不超过4个。位于悬浮菜单的建议操作和建议回复按钮总数量不超过11 个。每个建议操作和每个建议回复的展示文字（Display Text）最多为25个字符（Byte）。
>
> ​		 富媒体卡片携带文件时，单个卡片中可以携带2个文件，分别为原文件和缩略图文件， 且由chatbot指定原文件和缩略图，用作缩略图的文件必须为不大于200K的图片文件。

示例：

~~~json
{
    "messageId":"cb1188a3-37ec-1037-9054-2dc66e44375b",
    "messageList":[
        {
            "contentType":"application/vnd.gsma.botmessage.v1.0+json",
            "contentText":{
                "message":{
                    "generalPurposeCard":{
                        "layout":{
                            "cardOrientation":"HORIZONTAL",
                            "imageAlignment":"LEFT",
                            "titleFontStyle":[
                                "underline",
                                "bold"
                            ],
                            "descriptionFontStyle":[
                                "calibri"
                            ],
                            "style":"http://example.com/default.css"
                        },
                        "content":{
                            "media":{
                                "mediaUrl":"http://xxxxx6e4aa6c5274f0. mp4",
                                "mediaContentType":"video/mp4",
                                "mediaFileSize":2718288,
                                "thumbnailUrl":"http://xxxxx4aa6c5274f 0.jpg",
                                "thumbnailContentType":"image/png",
                                "thumbnailFileSize":314159,
                                "height":"MEDIUM_HEIGHT",
                                "contentDescription":"Textual description of media content, e. g. for use with screen readers."
                            },
                            "title":"This is a single rich card.",
                            "description":"This is the description of the rich card. It's the first field that will be truncated if it exceeds the maximum width or height of a card.",
                            "suggestions":[
                                {
                                    "reply":{
                                        "displayText":"No",
                                        "postback":{
                                            "data":"set_by_chatbot_reply_no"
                                        }
                                    }
                                },
                                {
                                    "action":{
                                        "urlAction":{
                                            "openUrl":{
                                                "url":"https://www.10010.cn",
                                                "application":"webview",
                                                "viewMode":"half"
                                            }
                                        },
                                        "displayText":"Open website or deep link",
                                        "postback":{
                                            "data":"set_by_chatbot_open_url"
                                        }
                                    }
                                },
                                {
                                    "action":{
                                        "dialerAction":{
                                            "dialPhoneNumber":{
                                                "phoneNumber":"+8617928222350"
                                            }
                                        },
                                        "displayText":"Call a phone number",
                                        "postback":{
                                            "data":"set_by_chatbot_open_dialer"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    ],
    "trafficType":"advertisement",
    "destinationAddress":[
        "tel:+8617928222350"
    ],
    "smsSupported":false,
    "storeSupported":false,
    "senderAddress":"sip:106500@botplatform.rcs.domain.cn",
    "serviceCapability":[
        {
            "capabilityId":"ChatbotSA",
            "version":"+g.gsma.rcs.botversion=\"#=1\""
        }
    ],
    "conversationId":"XSFDSFDFSAFDSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

### <a name="24">6. 富媒体多卡片消息(带 CSS 样式) + Suggestions</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> ​		每条消息卡片标题字数不超过200字，描述内容不超过2000字。一条富媒体多卡片消息 中最多12个卡片。单个卡片内的建议操作和建议回复按钮总数量不超过4个。位于悬浮菜单 的建议操作和建议回复按钮总数量不超过11个。每个建议操作和每个建议回复的展示文字 （Display Text）最多为25个字符（Byte）。
>
> ​		富媒体卡片携带文件时，单个卡片中可以携带2个文件，分别为原文件和缩略图文件， 且由chatbot指定原文件和缩略图，用作缩略图的文件必须为不大于200K的图片文件。

~~~json
{
    "messageId":"cb1188a3-37ec-1037-9054-2dc66e44375b",
    "messageList":[
        {
            "contentType":"application/vnd.gsma.botmessage.v1.0+json",
            "contentText":{
                "message":{
                    "generalPurposeCardCarousel":{
                        "layout":{
                            "cardWidth":"MEDIUM_WIDTH"
                        },
                        "content":[
                            {
                                "media":{
                                    "mediaUrl":"http://124.127.121.100/temp/src/2020062217asdfkjaoskd/836ee/view/37,3c3504f6e4cc6c5274f0. mp4",
                                    "mediaContentType":"video/mp4",
                                    "thumbnailUrl":"http://124.127.121.100/temp/src/2020062217asdfkjaoskd/836ee/view/37,3c3344f6e4cc6c5274f0. jpg",
                                    "thumbnailContentType":"image/png",
                                    "height":"SHORT_HEIGHT"
                                },
                                "title":"This is the first rich card in a carousel.",
                                "description":"This is the description of the rich card. It's the first field that will be truncated if it exceeds the maximum width or height of a card.",
                                "suggestions":[
                                    {
                                        "action":{
                                            "mapAction":{
                                                "showLocation":{
                                                    "location":{
                                                        "latitude":37.4220041,
                                                        "longitude":-122.0862515,
                                                        "label":"Googleplex"
                                                    },
                                                    "fallbackUrl":"https://www.google.com/maps/@37.4219162,-122.078063,15z"
                                                }
                                            },
                                            "displayText":"Show location on a map",
                                            "postback":{
                                                "data":"set_by_chatbot_open_map"
                                            }
                                        }
                                    },
                                    {
                                        "action":{
                                            "calendarAction":{
                                                "createCalendarEvent":{
                                                    "startTime":"2017-03-14T00:00:00Z",
                                                    "endTime":"2017-03-14T23:59:59Z",
                                                    "title":"Meeting",
                                                    "description":"GSG review meeting"
                                                }
                                            },
                                            "displayText":"Schedule Meeting",
                                            "postback":{
                                                "data":"set_by_chatbot_create_calendar_event"
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                "title":"This is the second rich card in the carousel.",
                                "description":"Carousel cards need to specify a card width in the 'layout' section. For small width cards, only short and medium height media are supported.",
                                "[...]":"[...]"
                            }
                        ]
                    }
                }
            }
        },
        {
            "contentType":"application/vnd.gsma.botsuggestion.v1.0+json",
            "contentText":{
                "suggestions":[
                    {
                        "reply":{
                            "displayText":"Yes",
                            "postback":{
                                "data":"set_by_chatbot_reply_yes"
                            }
                        }
                    },
                    {
                        "reply":{
                            "displayText":"No",
                            "postback":{
                                "data":"set_by_chatbot_reply_no"
                            }
                        }
                    },
                    {
                        "action":{
                            "urlAction":{
                                "openUrl":{
                                    "url":"https://www.10010.com"
                                }
                            },
                            "displayText":"Open website or deep link",
                            "postback":{
                                "data":"set_by_chatbot_open_url"
                            }
                        }
                    },
                    {
                        "action":{
                            "dialerAction":{
                                "dialPhoneNumber":{
                                    "phoneNumber":"+8617928222350"
                                }
                            },
                            "displayText":"Call a phone number",
                            "postback":{
                                "data":"set_by_chatbot_open_dialer"
                            }
                        }
                    }
                ]
            }
        }
    ],
    "trafficType":"advertisement",
    "destinationAddress":[
        "tel:+8617928222350"
    ],
    "smsSupported":false,
    "storeSupported":false,
    "senderAddress":"sip:106500@botplatform.rcs.domain.cn",
    "serviceCapability":[
        {
            "capabilityId":"ChatbotSA",
            "version":"+g.gsma.rcs.botversion=\"#=1\""
        }
    ],
    "conversationId":"XSFDSFDFSAFDSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

### <a name="25">7. 富媒体卡片消息语法</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

**此部分为Json Scheme，非消息样例。**

~~~json
{
    "$schema":"http://json-schema.org/draft-04/schema#",
    "id":"http://www.gsma.com/rcs/chatbot_message_schema.json",
    "title":"Root Object",
    "type":"object",
    "properties":{
        "message":{
            "title":"A chatbot message, sent from chatbot platform to client.",
            "type":"object",
            "oneOf":[
                {
                    "$ref":"#/definitions/messages/generalPurposeCardMessage"
                },
                {
                    "$ref":"#/definitions/messages/generalPurposeCardCarouselMessage"
                }
            ]
        },
        "suggestions":{
            "title":"Suggested replies and/or suggested actions for a chatbot message, send from chatbot platform to client.",
            "type":"array",
            "items":{
                "oneOf":[
                    {
                        "$ref":"#/definitions/suggestions/replies/reply"
                    },
                    {
                        "$ref":"#/definitions/suggestions/actions/action"
                    }
                ]
            },
            "minItems":1,
            "maxItems":11,
            "additionalItems":false
        },
        "response":{
            "title":"Response to a suggested reply or suggested action, sent from client to chatbot platform.",
            "type":"object",
            "oneOf":[
                {
                    "properties":{
                        "reply":{
                            "$ref":"#/definitions/suggestions/suggestion"
                        }
                    },
                    "required":[
                        "reply"
                    ]
                },
                {
                    "properties":{
                        "action":{
                            "$ref":"#/definitions/suggestions/suggestion"
                        }
                    },
                    "required":[
                        "action"
                    ]
                }
            ]
        },
        "sharedData":{
            "title":"Data shared by the client with the chatbot platform (e. g. device specifics).",
            "type":"object",
            "oneOf":[
                {
                    "properties":{
                        "deviceSpecifics":{
                            "$ref":"#/definitions/sharedData/deviceSpecifics"
                        }
                    }
                }
            ]
        }
    },
    "oneOf":[
        {
            "required":[
                "message"
            ]
        },
        {
            "required":[
                "suggestions"
            ]
        },
        {
            "required":[
                "response"
            ]
        },
        {
            "required":[
                "sharedData"
            ]
        }
    ],
    "definitions":{
        "messageFragments":{
            "cardMedia":{
                "type":"object",
                "properties":{
                    "mediaUrl":{
                        "type":"string",
                        "format":"uri"
                    },
                    "mediaContentType":{
                        "type":"string"
                    },
                    "mediaFileSize":{
                        "title":"Media file size in bytes",
                        "type":"integer",
                        "minimum":0
                    },
                    "thumbnailUrl":{
                        "type":"string",
                        "format":"uri"
                    },
                    "thumbnailContentType":{
                        "type":"string"
                    },
                    "thumbnailFileSize":{
                        "title":"Thumbnail file size in bytes",
                        "type":"integer",
                        "minimum":0
                    },
                    "height":{
                        "type":"string",
                        "enum":[
                            "SHORT_HEIGHT",
                            "MEDIUM_HEIGHT",
                            "TALL_HEIGHT"
                        ]
                    },
                    "contentDescription":{
                        "title":"Optional textual description of media content",
                        "description":"Accessiblity text for use with screen readers. Will not be shown on screen.",
                        "type":"string",
                        "minLength":1,
                        "maxLength":200
                    }
                },
                "required":[
                    "mediaUrl",
                    "mediaContentType",
                    "mediaFileSize",
                    "height"
                ],
                "dependencies":{
                    "thumbnailUrl":[
                        "thumbnailContentType",
                        "thumbnailFileSize"
                    ]
                }
            },
            "cardTitle":{
                "type":"string",
                "minLength":1,
                "maxLength":200
            },
            "cardDescription":{
                "type":"string",
                "minLength":1,
                "maxLength":2000
            },
            "fontStyle":{
                "type":"array",
                "items":{
                    "type":"string",
                    "enum":[
                        "italics",
                        "bold",
                        "underline"
                    ]
                },
                "minItems":1,
                "maxItems":3,
                "additionalItems":false
            },
            "cardStyle":{
                "title":"A reference to a CSS for the rendering of the Rich Card(s). To be used as defined in 3.6.10.5.4",
                "type":"string",
                "format":"uri"
            }
        },
        "messages":{
            "generalPurposeCardMessage":{
                "title":"This defines a general-purpose, standalone Rich Card message.",
                "type":"object",
                "properties":{
                    "generalPurposeCard":{
                        "type":"object",
                        "properties":{
                            "layout":{
                                "type":"object",
                                "oneOf":[
                                    {
                                        "properties":{
                                            "cardOrientation":{
                                                "type":"string",
                                                "enum":[
                                                    "VERTICAL"
                                                ]
                                            },
                                            "titleFontStyle":{
                                                "$ref":"#/definitions/messageFragments/fontStyle"
                                            },
                                            "descriptionFontStyle":{
                                                "$ref":"#/definitions/messageFragments/fontStyle"
                                            },
                                            "style":{
                                                "$ref":"#/definitions/messageFragments/cardStyle"
                                            }
                                        },
                                        "required":[
                                            "cardOrientation"
                                        ]
                                    },
                                    {
                                        "properties":{
                                            "cardOrientation":{
                                                "type":"string",
                                                "enum":[
                                                    "HORIZONTAL"
                                                ]
                                            },
                                            "imageAlignment":{
                                                "type":"string",
                                                "enum":[
                                                    "LEFT",
                                                    "RIGHT"
                                                ]
                                            },
                                            "titleFontStyle":{
                                                "$ref":"#/definitions/messageFragments/fontStyle"
                                            },
                                            "descriptionFontStyle":{
                                                "$ref":"#/definitions/messageFragments/fontStyle"
                                            },
                                            "style":{
                                                "$ref":"#/definitions/messageFragments/cardStyle"
                                            }
                                        },
                                        "required":[
                                            "cardOrientation",
                                            "imageAlignment"
                                        ]
                                    }
                                ]
                            },
                            "content":{
                                "type":"object",
                                "properties":{
                                    "media":{
                                        "$ref":"#/definitions/messageFragments/cardMedia"
                                    },
                                    "title":{
                                        "$ref":"#/definitions/messageFragments/cardTitle"
                                    },
                                    "description":{
                                        "$ref":"#/definitions/messageFragments/cardDescription"
                                    },
                                    "suggestions":{
                                        "type":"array",
                                        "items":{
                                            "oneOf":[
                                                {
                                                    "$ref":"#/definitions/suggestions/replies/reply"
                                                },
                                                {
                                                    "$ref":"#/definitions/suggestions/actions/action"
                                                }
                                            ]
                                        },
                                        "minItems":1,
                                        "maxItems":4,
                                        "additionalItems":false
                                    }
                                },
                                "anyOf":[
                                    {
                                        "required":[
                                            "media"
                                        ]
                                    },
                                    {
                                        "required":[
                                            "title"
                                        ]
                                    },
                                    {
                                        "required":[
                                            "description"
                                        ]
                                    }
                                ]
                            }
                        },
                        "required":[
                            "layout",
                            "content"
                        ]
                    }
                },
                "required":[
                    "generalPurposeCard"
                ]
            },
            "generalPurposeCardCarouselMessage":{
                "title":"This defines a message containing a carousel of general-purpose Rich Cards.",
                "type":"object",
                "properties":{
                    "generalPurposeCardCarousel":{
                        "type":"object",
                        "properties":{
                            "layout":{
                                "type":"object",
                                "properties":{
                                    "cardWidth":{
                                        "type":"string",
                                        "enum":[
                                            "SMALL_WIDTH",
                                            "MEDIUM_WIDTH"
                                        ],
                                        "default":"SMALL_WIDTH"
                                    },
                                    "titleFontStyle":{
                                        "$ref":"#/definitions/messageFragments/fontStyle"
                                    },
                                    "descriptionFontStyle":{
                                        "$ref":"#/definitions/messageFragments/fontStyle"
                                    },
                                    "style":{
                                        "$ref":"#/definitions/messageFragments/cardStyle"
                                    }
                                },
                                "required":[
                                    "cardWidth"
                                ]
                            },
                            "content":{
                                "type":"array",
                                "items":{
                                    "type":"object",
                                    "properties":{
                                        "media":{
                                            "$ref":"#/definitions/messageFragments/cardMedia"
                                        },
                                        "title":{
                                            "$ref":"#/definitions/messageFragments/cardTitle"
                                        },
                                        "description":{
                                            "$ref":"#/definitions/messageFragments/cardDescription"
                                        },
                                        "suggestions":{
                                            "type":"array",
                                            "items":{
                                                "oneOf":[
                                                    {
                                                        "$ref":"#/definitions/suggestions/replies/reply"
                                                    },
                                                    {
                                                        "$ref":"#/definitions/suggestions/actions/action"
                                                    }
                                                ]
                                            },
                                            "minItems":1,
                                            "maxItems":4,
                                            "additionalItems":false
                                        }
                                    },
                                    "anyOf":[
                                        {
                                            "required":[
                                                "media"
                                            ]
                                        },
                                        {
                                            "required":[
                                                "title"
                                            ]
                                        },
                                        {
                                            "required":[
                                                "description"
                                            ]
                                        }
                                    ]
                                },
                                "minItems":2,
                                "maxItems":12,
                                "additionalItems":false
                            }
                        },
                        "required":[
                            "layout",
                            "content"
                        ]
                    }
                },
                "required":[
                    "generalPurposeCardCarousel"
                ]
            }
        },
        "suggestionFragments":{
            "postback":{
                "title":"Definition of data to be posted back from UE to chatbot.",
                "type":"object",
                "properties":{
                    "data":{
                        "type":"string",
                        "maxLength":2048
                    }
                },
                "required":[
                    "data"
                ]
            }
        },
        "suggestions":{
            "suggestion":{
                "title":"Common base definition for suggested replies and suggested actions.",
                "type":"object",
                "properties":{
                    "displayText":{
                        "type":"string",
                        "minLength":1,
                        "maxLength":25
                    },
                    "postback":{
                        "$ref":"#/definitions/suggestionFragments/postback"
                    }
                },
                "required":[
                    "displayText"
                ]
            },
            "replies":{
                "reply":{
                    "title":"Definition of a suggested reply.",
                    "type":"object",
                    "properties":{
                        "reply":{
                            "allOf":[
                                {
                                    "$ref":"#/definitions/suggestions/suggestion"
                                }
                            ]
                        }
                    },
                    "required":[
                        "reply"
                    ]
                }
            },
            "actions":{
                "action":{
                    "title":"Common base definition of a suggested action.",
                    "type":"object",
                    "properties":{
                        "action":{
                            "type":"object",
                            "allOf":[
                                {
                                    "$ref":"#/definitions/suggestions/suggestion"
                                },
                                {
                                    "oneOf":[
                                        {
                                            "$ref":"#/definitions/suggestions/actions/urlAction"
                                        },
                                        {
                                            "$ref":"#/definitions/suggestions/actions/dialerAction"
                                        },
                                        {
                                            "$ref":"#/definitions/suggestions/actions/mapAction"
                                        },
                                        {
                                            "$ref":"#/definitions/suggestions/actions/calendarAction"
                                        },
                                        {
                                            "$ref":"#/definitions/suggestions/actions/composeAction"
                                        },
                                        {
                                            "$ref":"#/definitions/suggestions/actions/deviceAction"
                                        },
                                        {
                                            "$ref":"#/definitions/suggestions/actions/settingsAction"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "action"
                    ]
                },
                "urlAction":{
                    "title":"Suggested actions to interact a website or deep app link.",
                    "properties":{
                        "urlAction":{
                            "type":"object",
                            "oneOf":[
                                {
                                    "properties":{
                                        "openUrl":{
                                            "type":"object",
                                            "oneOf":[
                                                {
                                                    "properties":{
                                                        "url":{
                                                            "type":"string",
                                                            "format":"uri"
                                                        },
                                                        "application":{
                                                            "type":"string",
                                                            "enum":[
                                                                "browser"
                                                            ]
                                                        }
                                                    },
                                                    "required":[
                                                        "url",
                                                        "application"
                                                    ]
                                                },
                                                {
                                                    "properties":{
                                                        "url":{
                                                            "type":"string",
                                                            "format":"uri"
                                                        },
                                                        "application":{
                                                            "type":"string",
                                                            "enum":[
                                                                "webview"
                                                            ]
                                                        },
                                                        "viewMode":{
                                                            "type":"string",
                                                            "enum":[
                                                                "full",
                                                                "half",
                                                                "tall"
                                                            ]
                                                        },
                                                        "parameters":{
                                                            "type":"string",
                                                            "minLength":1,
                                                            "maxLength":200
                                                        }
                                                    },
                                                    "required":[
                                                        "url",
                                                        "application"
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    "required":[
                                        "openUrl"
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "urlAction"
                    ]
                },
                "dialerAction":{
                    "title":"Suggested actions for interacting with a phone number.",
                    "properties":{
                        "dialerAction":{
                            "type":"object",
                            "oneOf":[
                                {
                                    "properties":{
                                        "dialPhoneNumber":{
                                            "type":"object",
                                            "properties":{
                                                "phoneNumber":{
                                                    "type":"string"
                                                },
                                                "fallbackUrl":{
                                                    "type":"string",
                                                    "format":"uri"
                                                }
                                            },
                                            "required":[
                                                "phoneNumber"
                                            ]
                                        }
                                    },
                                    "required":[
                                        "dialPhoneNumber"
                                    ]
                                },
                                {
                                    "properties":{
                                        "dialEnrichedCall":{
                                            "type":"object",
                                            "properties":{
                                                "phoneNumber":{
                                                    "type":"string"
                                                },
                                                "subject":{
                                                    "type":"string",
                                                    "maxLength":60
                                                },
                                                "fallbackUrl":{
                                                    "type":"string",
                                                    "format":"uri"
                                                }
                                            },
                                            "required":[
                                                "phoneNumber"
                                            ]
                                        }
                                    },
                                    "required":[
                                        "dialEnrichedCall"
                                    ]
                                },
                                {
                                    "properties":{
                                        "dialVideoCall":{
                                            "type":"object",
                                            "properties":{
                                                "phoneNumber":{
                                                    "type":"string"
                                                },
                                                "fallbackUrl":{
                                                    "type":"string",
                                                    "format":"uri"
                                                }
                                            },
                                            "required":[
                                                "phoneNumber"
                                            ]
                                        }
                                    },
                                    "required":[
                                        "dialVideoCall"
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "dialerAction"
                    ]
                },
                "mapAction":{
                    "title":"Suggested actions for interacting with a location on a map.",
                    "properties":{
                        "mapAction":{
                            "type":"object",
                            "oneOf":[
                                {
                                    "properties":{
                                        "showLocation":{
                                            "title":"Shows a given location on a map.",
                                            "type":"object",
                                            "properties":{
                                                "location":{
                                                    "type":"object",
                                                    "properties":{
                                                        "latitude":{
                                                            "type":"number"
                                                        },
                                                        "longitude":{
                                                            "type":"number"
                                                        },
                                                        "label":{
                                                            "type":"string",
                                                            "minLength":1,
                                                            "maxLength":100
                                                        },
                                                        "query":{
                                                            "title":"Search for location(s) by query",
                                                            "description":"Search is based on user's current location",
                                                            "examples":[
                                                                "restaurants",
                                                                "GSMA Head Office, 25 Walbrook, London, UK"
                                                            ],
                                                            "type":"string",
                                                            "minLength":1,
                                                            "maxLength":200
                                                        }
                                                    },
                                                    "oneOf":[
                                                        {
                                                            "required":[
                                                                "latitude",
                                                                "longitude"
                                                            ]
                                                        },
                                                        {
                                                            "required":[
                                                                "query"
                                                            ]
                                                        }
                                                    ]
                                                },
                                                "fallbackUrl":{
                                                    "type":"string",
                                                    "format":"uri"
                                                }
                                            },
                                            "required":[
                                                "location"
                                            ]
                                        }
                                    },
                                    "required":[
                                        "showLocation"
                                    ]
                                },
                                {
                                    "properties":{
                                        "requestLocationPush":{
                                            "title":"One-time request to send a geo location push from UE to chatbot",
                                            "type":"object"
                                        }
                                    },
                                    "required":[
                                        "requestLocationPush"
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "mapAction"
                    ]
                },
                "calendarAction":{
                    "title":"Suggested actions for interacting with a calendar event.",
                    "properties":{
                        "calendarAction":{
                            "type":"object",
                            "oneOf":[
                                {
                                    "properties":{
                                        "createCalendarEvent":{
                                            "type":"object",
                                            "properties":{
                                                "startTime":{
                                                    "type":"string",
                                                    "format":"date-time"
                                                },
                                                "endTime":{
                                                    "type":"string",
                                                    "format":"date-time"
                                                },
                                                "title":{
                                                    "type":"string",
                                                    "minLength":1,
                                                    "maxLength":100
                                                },
                                                "description":{
                                                    "type":"string",
                                                    "minLength":1,
                                                    "maxLength":500
                                                },
                                                "fallbackUrl":{
                                                    "type":"string",
                                                    "format":"uri"
                                                }
                                            },
                                            "required":[
                                                "startTime",
                                                "endTime",
                                                "title"
                                            ]
                                        }
                                    },
                                    "required":[
                                        "createCalendarEvent"
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "calendarAction"
                    ]
                },
                "composeAction":{
                    "title":"Suggested actions for composing draft messages.",
                    "properties":{
                        "composeAction":{
                            "type":"object",
                            "oneOf":[
                                {
                                    "properties":{
                                        "composeTextMessage":{
                                            "title":"Compose a draft text message.",
                                            "type":"object",
                                            "properties":{
                                                "phoneNumber":{
                                                    "type":"string"
                                                },
                                                "text":{
                                                    "type":"string",
                                                    "maxLength":100
                                                }
                                            },
                                            "required":[
                                                "phoneNumber",
                                                "text"
                                            ]
                                        }
                                    },
                                    "required":[
                                        "composeTextMessage"
                                    ]
                                },
                                {
                                    "properties":{
                                        "composeRecordingMessage":{
                                            "title":"Compose a draft message with a media recording.",
                                            "type":"object",
                                            "properties":{
                                                "phoneNumber":{
                                                    "type":"string"
                                                },
                                                "type":{
                                                    "type":"string",
                                                    "enum":[
                                                        "AUDIO",
                                                        "VIDEO"
                                                    ]
                                                }
                                            },
                                            "required":[
                                                "phoneNumber",
                                                "type"
                                            ]
                                        }
                                    },
                                    "required":[
                                        "composeRecordingMessage"
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "composeAction"
                    ]
                },
                "deviceAction":{
                    "title":"Suggested actions for interacting with the user's device.",
                    "properties":{
                        "deviceAction":{
                            "type":"object",
                            "oneOf":[
                                {
                                    "properties":{
                                        "requestDeviceSpecifics":{
                                            "title":"Request specifics about the user's device.",
                                            "type":"object"
                                        }
                                    },
                                    "required":[
                                        "requestDeviceSpecifics"
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "deviceAction"
                    ]
                },
                "settingsAction":{
                    "title":"Suggested actions for interacting with app settings",
                    "properties":{
                        "settingsAction":{
                            "type":"object",
                            "oneOf":[
                                {
                                    "properties":{
                                        "disableAnonymization":{
                                            "title":"Ask the user to disable the anonymization setting.",
                                            "type":"object"
                                        }
                                    },
                                    "required":[
                                        "disableAnonymization"
                                    ]
                                },
                                {
                                    "properties":{
                                        "enableDisplayedNotifications":{
                                            "title":"Ask the user to enable sending displayed notifications.",
                                            "type":"object"
                                        }
                                    },
                                    "required":[
                                        "enableDisplayedNotifications"
                                    ]
                                }
                            ]
                        }
                    },
                    "required":[
                        "settingsAction"
                    ]
                }
            }
        },
        "sharedData":{
            "deviceSpecifics":{
                "title":"Device specifics shared by the client with the chatbot platform.",
                "type":"object",
                "properties":{
                    "deviceModel":{
                        "title":"Short description of the device model.",
                        "type":"string",
                        "minLength":1,
                        "maxLength":10
                    },
                    "platformVersion":{
                        "title":"Version information about the operating system on the device .",
                        "type":"string",
                        "minLength":1,
                        "maxLength":20
                    },
                    "clientVendor":{
                        "title":"Short code for client vendor, same as used during RCS autoconfiguration.",
                        "type":"string",
                        "minLength":1,
                        "maxLength":4
                    },
                    "clientVersion":{
                        "title":"Version information about the client, same as used during RCS autoconfiguration ",
                        "type":"string",
                        "minLength":1,
                        "maxLength":15
                    },
                    "batteryRemainingMinutes":{
                        "title":"Remaining battery use of device in minutes",
                        "type":"integer",
                        "minimum":0
                    }
                }
            }
        }
    }
}
~~~

### <a name="26">8. 群发消息（文本消息）</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

**当前版本暂时不支持消息群发**

~~~json
{
    "messageId":"cb1188a3-37ec-1037-9054-2dc66e44375b",
    "messageList":[
        {
            "contentType":"text/plain",
            "contentText":"hello world"
        }
    ],
    "destinationAddress":[
        "tel:+8617928222350",
        "tel:+8615067451862",
        "tel:+8615067451863"
    ],
    "senderAddress":"sip:106500@botplatform.rcs.domain.cn",
    "smsSupported":false,
    "storeSupported":false,
    "serviceCapability":[
        {
            "capabilityId":"ChatbotSA",
            "version":"+g.gsma.rcs.botversion=\"#=1\""
        }
    ],
    "conversationId":"XSFDSFDFSAFDSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

## <a name="27">七、Chatbot 发送撤回消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向**：Chatbot → 5G 消息业务平台 

- **请求方法**：`HTTPS POST` 

- **请求URL: https://{serverRoot}/bot/{apiVersion}/{chatbotId}/revoke**

- **接口说明**：当Chatbot将消息发送到5G消息业务管理平台后，消息处于送达终端之前，Chatbot可将消息撤回。当Chatbot希望将发往终端的消息撤回时，Chatbot调用此接口进行消息撤回操作。 用于Chatbot发送撤回请求到5G消息业务管理平台的场景。

- **请求体：**

  | 序号 | 字段               | 数据类型 | 可选属性 | 描述                                         |
  | ---- | ------------------ | -------- | -------- | -------------------------------------------- |
  | 1    | messageId          | string   | 必选     | 消息ID，由UUID算法生成的字符串+chatbotID组成 |
  | 2    | destinationAddress | array    | 必选     | 用户URI list， tel格式                       |
  | 3    | status             | string   | 必选     | 值RevokeRequested，请求撤回消息              |
  
- **返回体：**

  | 序号 | 字段         | 数据类型 | 可选属性 | 描述                                        |
  | ---- | ------------ | -------- | -------- | ------------------------------------------- |
  | 1    | messageId    | string   | 必选     | 消息ID                                      |
  | 2    | errorCode    | int      | 必选     | 状态码，0：成功<br />其它状态参见返回码说明 |
  | 3    | errorMessage | string   | 可选     | 错误描述                                    |

  示例：

  ~~~json
  { 
      "messageId": "cb1188a3-37ec-1037-9054-2dc66e44375b", 
      "errorCode": 0， 
      "errorMessage": "success" 
  }
  ~~~

  

### <a name="28">1. 请求撤回单条消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

示例：

~~~json
{ 
    "messageId": "cb1188a3-37ec-1037-9054-2dc66e44375b", 
    "status": "RevokeRequested", 
    "destinationAddress": [ 
        "tel:+8617928222350" 
    ] 
}
~~~

### <a name="29">2. 请求撤回多条消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

> 前期版本暂时不支持消息群发，因此撤回多条消息功能暂不开放

示例：

~~~json
{ 
    "messageId": "cb1188a3-37ec-1037-9054-2dc66e44375b", 
    "status": "RevokeRequested", 
    "destinationAddress": [ 
        "tel:+8617928222350", 
        "tel:+8615067451862", 
        "tel:+8615067451863" ] 
}
~~~

## <a name="30">八、Chatbot 接收消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** 5G 消息业务平台 → Chatbot 

- **请求方法：** `HTTPS POST` 

- **请求 URL：http://{notifyURL}/messageNotification/{chatbotId}/messages**

- **接口说明：**  用于5G消息业务管理平台向Chatbot发送上行消息的场景。

- **请求头：**

  | 序号 | 字段           | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | -------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | signature      | string   | 必选     | 加密签名，signature结合了Chatbot在申请时填写的token和请求中的 timestamp 参数、nonce参数。 |
  | 2    | timestamp      | long     | 必选     | Linux时间戳，即1970年1月1日以来经过的秒数                    |
  | 3    | nonce          | string   | 必选     | 采用UUID算法生成                                             |
  | 4    | content-type   | string   | 必选     | multipart/form-data                                          |
  | 5    | accept         | string   | 必选     | 接受的数据类型类型，本协议取值<br /> application/json        |
  | 6    | host           | string   | 必选     | 请求服务器的域名/IP地址和端口号                              |
  | 7    | content-length | long     | 可选     | 内容长度                                                     |

- **请求体：**

  | 序号 | 字段               | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ------------------ | -------- | -------- | ------------------------------------------------------------ |
  | 1    | messageId          | string   | 必选     | 消息ID                                                       |
  | 2    | messageList        | array    | 必选     | 消息内容结构体，具体参数说明见下                             |
  | 3    | dataTime           | string   | 必选     | 消息时间戳， <br />格式: yyyy-MM-ddTHH:mm:sszzz <br />例如：2020-01-17T14:42:20.840+08:00 |
  | 4    | senderAddress      | string   | 必选     | 发送方地址From，群发时填写Chatbot 的URI，广播时填写Chatbot的URI（暂不提供） |
  | 5    | destinationAddress | array    | 必选     | 用户URI list， tel格式                                       |
  | 6    | conversationId     | string   | 必选     | 唯一标识主被叫用户间的一个聊天对话                           |
  | 7    | contributionId     | string   | 必选     | 唯一标识一个聊天会话                                         |
  | 8    | priority           | string   | 可选     | 消息优先级                                                   |
  | 9    | origUser           | string   | 可选     | 原始消息发送方                                               |
  | 10   | inReplyTo          | string   | 可选     | 该标识是对另一条消息的回复，值是一 条上行消息的contributionId。 |
  | 11   | reportRequest      | array    | 可选     | 状态事件报告列表，每个状态事件的可选值为: <br />failed：消息发送失败 <br />delivered：消息已送达 <br /> |

- **messageList内容的结构体：**

  | 序号 | 字段            | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | --------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | contentType     | string   | 必选     | 混合消息（multipart/mixed）中，其中一个消息的类型，取值如下： <br />text/plain：文本消息/地理位置回落消息 <br />application/vnd.gsma.rcs-ft-http：文件消息 <br />application/vnd.gsma.botmessage.v1.0+json： 富媒体卡片消息 <br />application/vnd.gsma.botsuggestion.v1.0+jso n：Suggested Chip List带建议回复列表的消息 |
  | 2    | contentEncoding | string   | 可选     | 消息内容(contentText)编码方式。 <br />默认为utf8字符编码,可选base64编码。 |
  | 3    | contentText     | object   | 必选     | contentEncoding为base64时，内容编码后的 base64 字符串。<br />contentType为"text/plain"时，内容为字符串 <br />contentType为其他的类型时，内容为json对 象 |

### <a name="31">1. 文本消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

~~~json
{
    "messageId":"4BF4F950-A0B6-4CC3-86B4-5A9580399BCA",
    "messageList":[
        {
            "contentType":"text/plain",
            "contentText":"hello world"
        }
    ],
    "dateTime":"2020-01-17T14:42:20.840+08:00",
    "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
    "senderAddress":"tel:+8617928222350",
    "conversationId":"XSFDSFDFSAFDSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

### <a name="32">2. 文件消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

~~~json
{
    "messageId":"3918E80F-9958-4895-A7A5-B1CA8027BCA7",
    "messageList":[
        {
            "contentType":"application/vnd.gsma.rcs-ft-http",
            "contentEncoding":"utf8",
            "contentText":[
                {
                    "type":"thumbnail",
                    "fileSize":7427,
                    "contentType":"image/jpg",
                    "url":"https://xxx759fbf6b",
                    "until":"2019-04-25T12:17:07Z"
                },
                {
                    "type":"file",
                    "fileSize":183524,
                    "fileName":"DSC_379395051.JPG",
                    "contenType":"image/jpg",
                    "url":"https://xxx3e8e",
                    "until":"2019-04-25T12:17:07Z"
                }
            ]
        }
    ],
    "dateTime":"2020-01-17T14:42:39.670+08:00",
    "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
    "senderAddress":"tel:+8617928222350",
    "conversationId":"XSFDSFDFSAFDSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

### <a name="33">3. 地理位置回落消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

~~~json
{
    "messageId":"4BF4F950-A0B6-4CC3-86B4-5A9580399BCA",
    "messageList":[
        {
            "contentType":"text/plain",
            "contentText":"geo:50.7311865,7.0914591;crs=gcj02;u=10;rcs-l=Qingfeng%20Steamed%20Dumpling%20Shop %20%F0%9F%8D%9A"
        }
    ],
    "dateTime":"2020-01-17T14:42:20.840+08:00",
    "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
    "senderAddress":"tel:+8617928222350",
    "conversationId":"XSFDSFDFSAFDSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

### <a name="34">4. 建议回复消息的回复</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

~~~json
{
    "messageId":"424c118f-ebe6-45e0-916b-4291498cdf87",
    "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
    "senderAddress":"tel:+8617985550101",
    "messageList":[
        {
            "contentType":"application/vnd.gsma.botsuggestion.response.v1.0+json",
            "contentEncoding":"utf8",
            "contentText":{
                "response":{
                    "reply":{
                        "displayText":"No",
                        "postback":{
                            "data":"set_by_chatbot_reply_no"
                        }
                    }
                }
            }
        }
    ],
    "conversationId":"XS12345646DSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

### <a name="35">5. 终端数据共享消息</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

~~~json
{
    "messageId":"aa941d32-f1cc-4a39-bfa2-38bc4465290a",
    "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
    "senderAddress":"tel:+8617985550101",
    "messageList":[
        {
            "contentType":"application/vnd.gsma.botsharedclientdata.v1.0+json",
            "contentEncoding":"utf8",
            "contentText":{
                "sharedData":{
                    "deviceSpecifics":{
                        "deviceModel":"OnePlus 7 Pro",
                        "platformVersion":"Android-9.1.2",
                        "clientVendor":"VNDR",
                        "clientVersion":"RCSAndrd-1.0",
                        "batteryRemainingMinutes":517
                    }
                }
            }
        }
    ],
    "conversationId":"XS12345646DSAS^%",
    "contributionId":"SFF$#REGFY7&^%THT"
}
~~~

## <a name="36">九、Chatbot 接收下行消息的状态报告 </a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** 5G 消息业务平台 → Chatbot 

- **请求方法：** `HTTP POST`

- **请求 URL：http://{notifyURL}/deliveryNotification/{chatbotId}/status**

- **接口说明：** 如果在下行消息中设置需要状态报告，那么状态报告将通过发送状态报告通知给应用。用于5G消息业务管理平台向Chatbot发送回执消息的场景。 

- **请求头：**

  | 序号 | 字段           | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | -------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | signature      | string   | 必选     | 加密签名，signature结合了Chatbot在申请时填写的token和请求中的 timestamp 参数、nonce参数。 |
  | 2    | timestamp      | long     | 必选     | Linux时间戳，即1970年1月1日以来经过的秒数                    |
  | 3    | nonce          | string   | 必选     | 采用UUID算法生成                                             |
  | 4    | content-type   | string   | 必选     | multipart/form-data                                          |
  | 5    | accept         | string   | 必选     | 接受的数据类型类型，本协议取值<br /> application/json        |
  | 6    | host           | string   | 必选     | 请求服务器的域名/IP地址和端口号                              |
  | 7    | content-length | long     | 可选     | 内容长度                                                     |

- **请求体：**

  | 序号 | 字段             | 数据类型 | 可选属性 | 描述                                       |
  | ---- | ---------------- | -------- | -------- | ------------------------------------------ |
  | 1    | deliveryInfoList | array    | 可选     | 返回的消息状态报告结构体，具体参数说明如下 |

- **deliveryInfoList 字段说明：**

  | 序号 | 字段                | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ------------------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | messageId           | string   | 必选     | 对应消息的消息ID                                             |
  | 2    | dateTime            | string   | 必选     | 消息时间戳， <br />格式：yyyy-MM-ddTHH:mm:sszzz <br />例如：2020-01-17T14:42:20.840+08:00 |
  | 3    | status              | string   | 必选     | 消息状态，主要有如下几种状态：<br />sent：消息已发送 <br />failed：消息发送失败 <br />delivered：消息已送达 <br />displayed：消息已阅读 <br />deliveredToNetwork：已转短信发送 <br />revokeOk：消息撤回成功 <br />revokeFail：消息撤回失败 |
  | 4    | errorCode           | int      | 可选     | 如果状态为fail，则需要带此参数。此参数表明发送失败的原因。取值为： <br />1：未找到终端 <br />2：非5G消息终端 <br />3：消息包含不合规内容 <br />4：终端离线 <br />5：终端已拒收 <br />6：消息内容不符合要求<br />其它返回码请参考返回码说明 |
  | 5    | errorMessage        | string   | 可选     | 如果状态为fail，则需要带此参数。此参数表明 发送失败的原因。例如：未找到终端；终端不 支持且本消息不支持回落等 |
  | 6    | destinationAd dress | string   | 必选     | 接收状态通知的目的地址                                       |
  | 7    | senderAddress       | string   | 必选     | 发送方用户URI ，tel格式                                      |

  示例：

  ~~~json
  {
      "deliveryInfoList":[
          {
              "messageId":"AC6A9C00-78C8-4BCC-9845-0F3BDCBE45EE",
              "status":"delivered",
              "dateTime":"2020-03-17T14:42:20.840+08:00",
              "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
              "senderAddress":"tel:+8617928222350"
          },
          {
              "messageId":"AC6A9C00-78C8-4BCC-9845-0F3BDCBE45EE",
              "status":"delivered",
              "dateTime":"2020-01-17T14:42:20.840+08:00",
              "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
              "senderAddress":"tel:+8617928222351"
          },
          {
              "messageId":"4566A9C00-5562-4BCC-9845-0F3BDCBE4FEF",
              "status":"failed",
              "errorCode":1,
              "errorMessage":"terminal not supported RCS and smsSupported is false",
              "dateTime":"2020-01-17T14:42:20.840+08:00",
              "destinationAddress":"sip:106500@botplatform.rcs.domain.cn",
              "senderAddress":"tel:+8617928222343"
          }
      ]
  }
  ~~~

## <a name="37">十、消息通知</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

### <a name="38">1. Chatbot 信息变更通知</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** 5G 消息业务平台 → Chatbot 

- **请求方法：** `HTTP POST`

- **请求URL：http://{notifyURL}/notifyInfoNotification/{chatbotId}/notice/informationChange**

- **接口说明：** Chatbot的信息发生变更，则平台向Chatbot推送信息变更通知。Chatbot信息变更主要存在两种情况：

  1. Chatbot必填信息发生变更
  2. Chatbot选填信息审核通过，信息变更生效

- **请求头：**

  | 序号 | 字段      | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | --------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | signature | string   | 必选     | 加密签名，signature结合了Chatbot在申请时填写的token和请求中的 timestamp 参数、nonce参数。 |
  | 2    | timestamp | long     | 必选     | Linux时间戳，即1970年1月1日以来经过的秒数                    |
  | 3    | nonce     | string   | 必选     | 采用UUID算法生成                                             |

### <a name="39">2. 终端举报通知</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** 5G 消息业务平台 → Chatbot 

- **请求 方法：** `HTTP POST`

- **请求 URL： http://{notifyURL}/notifyInfoNotification/{chatbotId}/notice/rcsspam**

- **接口说明：** 平台将用户举报信息推送给Chatbot

- **请求头：**

  | 序号 | 字段      | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | --------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | signature | string   | 必选     | 加密签名，signature结合了Chatbot在申请时填写的token和请求中的 timestamp 参数、nonce参数。 |
  | 2    | timestamp | long     | 必选     | Linux时间戳，即1970年1月1日以来经过的秒数                    |
  | 3    | nonce     | string   | 必选     | 采用UUID算法生成                                             |

- **请求体：**

  | 序号 | 字段      | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | --------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | messageId | array    | 可选     | 被投诉的Chatbot发送的消息的消息 ID组。 如果不携带则表示投诉Chatbot。 |
  | 2    | spamType  | string   | 可选     | 投诉类型，50字节以内                                         |
  | 3    | freeText  | string   | 可选     | 用户填写的投诉原因                                           |

  示例：

  ~~~json
  { 
      "messageId": [ 
          "cf9e4a75-663b-1032-ac45-159f940783c5" 
      ],
      "spamType": "垃圾消息", 
      "freeText": "全是广告" 
  }
  ~~~

### <a name="40">3. 审核结果通知</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

- **接口方向：** 5G 消息业务平台 → Chatbot 

- **请求方法：** `HTTP POST` 

- **请求 URL：http://{notifyURL}/notifyInfoNotification/{chatbotId}/check**

- **接口说明：** 平台将审核结果通知给Chatbot

- **请求头：**

  | 序号 | 字段      | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | --------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | signature | string   | 必选     | 加密签名，signature结合了Chatbot在申请时填写的token和请求中的 timestamp 参数、nonce参数。 |
  | 2    | timestamp | long     | 必选     | Linux时间戳，即1970年1月1日以来经过的秒数                    |
  | 3    | nonce     | string   | 必选     | 采用UUID算法生成                                             |

- **请求体：**

  | 序号 | 字段        | 数据类型 | 可选属性 | 描述                                                         |
  | ---- | ----------- | -------- | -------- | ------------------------------------------------------------ |
  | 1    | type        | string   | 必选     | "chatbotInformation"：平台对Chatbot 的选填信息审核后，将审核结果通知给 Chatbot。 <br />"media"：平台将永久素材的 审核结果返回给 Chatbot。审核通过的永 久素材可用，若审核不通过，则平台删除该素材。<br />"message":平台对 Chatbot 下发 的消息进行审核，将审核结果返回给 Chatbot，若涉及违规媒体内容，平台删除该媒体内容。 |
  | 2    | result      | string   | 必选     | 审 核 结 果 ： 审 核 通 过 / 审 核 不 通 过(pass/fail)       |
  | 3    | description | string   | 可选     | 平台运营人员/AI填写的审核备注                                |
  | 4    | time        | string   | 必选     | 审核时间：YY-MM-DD HH:MM:SS                                  |
  | 5    | remark      | string   | 可选     | 其它信息取值为： <br />素材审查：url： http://xxx74f0.mp4； <br />消息审查：messageId: cb118x4375b； <br />Chatbot 信息审查：chatbotId: sip:106xmain.cn |

- Chatbot 选填信息审核通知

  ~~~json
  { 
      "type": "chatbotInformation", 
      "result": "fail", 
      "time": "2020-01-17T14:42:20.840+08:00", 
      "description": "not match rules", 
      "remark": "chatbotId: sip:106500@botplatform.rcs.domain.cn" 
  }
  ~~~

- 素材审核通知 

  ~~~json
  { 
      "type": "media", 
      "result": "fail", 
      "time": "2020-01-17T14:42:20.840+08:00", 
      "description": "文件不符合规则"， 
      "remark": "url:http://124.xf0.mp4" 
  }
  ~~~

- 消息监管通知

  ~~~json
  { 
      "type": "message", 
      "result": "fail", 
      "time": "2020-01-17T14:42:20.840+08:00", 
      "description": "文件不符合规则", 
      "remark": "messageId: cb1188xe44375b" 
  }
  ~~~

## <a name="41">十一、富媒体卡片支持的 CSS 属性说明</a><a style="float:right;text-decoration:none;" href="#0">[Top]</a>

富媒体卡片的 CSS 控制元素包含以下四种： 

1. 整个富媒体卡片，与 CSS 中的消息选择器一起引用 
2. 富媒体卡片标题，与 CSS 中的 message.content.Title 选择器一起引用 
3. 富媒体卡片描述，与 CSS 中的 message.content.description 选择器一起引用 
4. 富媒体卡片建议，与 CSS 中的 message.content.suggestions 选择器一起引用

<img src="https://fabian.oss-cn-hangzhou.aliyuncs.com/img/image-20211116183222798.png" alt="image-20211116183222798"  />

![image-20211116183249475](https://fabian.oss-cn-hangzhou.aliyuncs.com/img/image-20211116183249475.png)



CSS 样式的非标准示例如下： 

~~~css
@charset "utf-8"; 
/* CSS Document */ 

Message { 
    text-align:center; 
    font-size:12px; 
    color:#555; 
    font-family:Verdana, Arial, Helvetica, sans-serif; 
    background-color: green; 
} 

message.content.title { 
    font-size:14px; 
    font-weight:bold; 
    color:#666699 
} 

message.content.description { 
    color:#666699 
} 

message.content.suggestions { 
    color:#669999 
}
~~~

