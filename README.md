# PUPPET-WALNUT

![PUPPET-WALNUT](https://github.com/wechaty/puppet-walnut/blob/main/docs/images/puppet-walnut.webp)

[![NPM Version](https://badge.fury.io/js/wechaty-puppet-mock.svg)](https://badge.fury.io/js/wechaty-puppet-mock)
[![npm (tag)](https://img.shields.io/npm/v/wechaty-puppet-mock/next.svg)](https://www.npmjs.com/package/wechaty-puppet-mock?activeTab=versions)
[![NPM](https://github.com/wechaty/wechaty-puppet-mock/workflows/NPM/badge.svg)](https://github.com/wechaty/wechaty-puppet-mock/actions?query=workflow%3ANPM)

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/wechaty/wechaty)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

## 前提环境

1. 申请 5G 开发者权限、应用调试工具。

   👉 [5G消息开发者社区平台](https://www.5g-msg.com)

2. 配置系统环境变量。

   - `WECHATY_PUPPET_WALNUT_APPID`: Chatbot的AppId。
   - `WECHATY_PUPPET_WALNUT_APPKEY`：Chatbot的AppKey。
   - `WECHATY_PUPPET_WALNUT_SIPID`: Chatbot的sipId。
   - `WECHATY_PUPPET`：wechaty-puppet-walnut

3. 配置公网环境

   > 如果是本地调试，则需要将在申请 5G 开发者时填入的公网地址，映射到本地才可以监听到`chatbot`接收到的消息

   这里推荐使用 [Frp](https://github.com/fatedier/frp)，来进行端口的映射。Walnut本身集成的 sever 端口默认为 **3000**，将公网地址映射到本地即可

## 运行方法

### 安装依赖

~~~shell
npm install wechaty
npm install wechaty-puppet-walnut
~~~

### 编写代码

~~~typescript
import { WechatyBuilder } from 'wechaty'

WechatyBuilder.build()  // get a Wechaty instance
  .on('message',       message => console.log(`Message: ${message}`))
  .start()
~~~

> Learn more for building your first Wechaty bot at <https://github.com/wechaty/>, <https://github.com/wechaty/getting-started>

## Wechaty API 支持

### Contact

- #### [Properties](https://wechaty.js.org/docs/api/contact#properties)

  | Name | Type     | Description                                                  | Support | Details      |
  | ---- | -------- | ------------------------------------------------------------ | ------- | ------------ |
  | id   | `string` | Get Contact id. This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table) | ✅       | Phone number |

- #### [Instance Methods](https://wechaty.js.org/docs/api/contact#instance-methods)

  | Instance Methods                    | Return type                                                  | Support | Details               |
  | ----------------------------------- | ------------------------------------------------------------ | ------- | --------------------- |
  | say(text Or Contact Or File Or Url) | `Promise`                                                    | ✅       |                       |
  | name()                              | `String`                                                     | ✅       | Phone number          |
  | alias(newAlias)                     | `Promise`                                                    | ✅       |                     |
  | friend()                            | `Boolean or null`                                            | ✅       | True           |
  | type()                              | `ContactType.Unknown or ContactType.Personal or ContactType.Official` | ✅       | ContactType.Personal  |
  | gender()                            | `ContactGender.Unknown or ContactGender.Male or ContactGender.Female` | ✅       | ContactGender.Unknown |
  | province()                          | `String or null`                                             | ❌       |                       |
  | city()                              | `String or null`                                             | ❌       |                       |
  | avatar()                            | `Promise`                                                    | ✅       | Default avatar        |
  | sync()                              | `Promise`                                                    | ✅       |                     |
  | self()                              | `Boolean`                                                    | ✅       |                       |

  > Default avatar 👉 https://raw.githubusercontent.com/wechaty/puppet-walnut/main/docs/images/avatar.webp

- #### [Static Methods](https://wechaty.js.org/docs/api/contact#static-methods)

  | Static Methods            | Return Type                 | Support | Detail |
  | ------------------------- | --------------------------- | ------- | ------ |
  | find(query)               | `Promise <Contact \| null>` | ✅       |        |
  | findAll(Query Arguements) | `Promise <Contact []>`      | ✅       |        |

## 项目介绍

“开源软件供应链点亮计划-暑期2021”（以下简称 暑期2021）是由中科院软件所与 openEuler 社区共同举办的一项面向高校学生的暑期活动，旨在鼓励在校学生积极参与开源软件的开发维护，促进国内优秀开源软件社区的蓬勃发展。

根据项目的难易程度和完成情况，参与者还可获取“开源软件供应链点亮计划-暑期2021”活动奖金和奖杯。

官网：<https://summer.iscas.ac.cn>

## Wechaty

[Wechaty](https://wechaty.js.org) 是一个开源聊天机器人框架SDK，具有高度封装、高可用的特性，支持NodeJs, Python, Go 和Java 等多语言版本。在过去的5年中，服务了数万名开发者，收获了 Github 的 9600 Star。同时配置了完整的DevOps体系并持续按照Apache 的方式管理技术社区。

## 项目名称

开发支持电信运营商 5G Chatbot / RCS 的 Wechaty 接入 Puppet 模块  

## 背景介绍

Wechaty 社区目前已经支持微信、Whatsapp、企业微信、飞书等常见流行即时通讯工具，并且能够通过多语言 SDK （比如 Python Wechaty） 进行调用。

5G Chatbot (RCS) 是近期中国电信运营商基于 5G 的消息战略落地平台，未来的 5G 手机将会内置 RCS 消息的处理能力。我们在本次 Summer 2021 的项目中，Wechaty 希望可以实现对RCS Chatbot 的支持。可以将 RCS 协议封装成为 `wechaty-puppet-walnut` 供 Wechaty 开发者方便接入 RCS 平台，使其成为 Wechaty 可以使用的社区生态模块。

## 需求介绍

使用 <https://github.com/wechaty/wechaty-puppet-official-account> 项目作为模版，将核心代码文件 <https://github.com/wechaty/wechaty-puppet-official-account/blob/master/src/puppet-oa.ts> 中的微信公众平台调用，全部替换（封装）为 RCS 模块的调用。

这里有一个专门讲解如何开发 Wechaty Puppet Provider 的 workshop 视频，它以 `wechaty-puppet-official-account` 作为例子，做了从0到1的入门讲解：[Wechaty Workshop for Puppet Makers: How to make a Puppet for Wechaty](https://wechaty.js.org/2020/08/05/wechaty-puppet-maker/)。通过观看这一个小时的视频，应该可以系统性的了解如何完成构建一个 Wechaty Puppet Provider 模块。

在初期开发中，能够实现文本消息的接收和发送，即可完成原型验证 POC 。

还可以参考以下链接：

1. TypeScript Puppet Official Documentation: <https://wechaty.github.io/wechaty-puppet/typedoc/classes/puppet.html>
2. Wechaty Puppet Specification: <https://wechaty.js.org/docs/specs/puppet>
3. <https://github.com/wechaty/wechaty-puppet-mock>

## 开发计划

## 导师联系方式

1. [李佳芮](https://wechaty.js.org/contributors/lijiarui/): Wechaty co-creator, Founder & CEO of Juzi.BOT (rui@chatie.io)
2. 康嘉: 硬核桃社区<https://www.5g-msg.com/> PM
3. [李卓桓](https://wechaty.js.org/contributors/huan)：Wechaty creator, Tencent TVP of Chatbot (huan@chatie.io)

## 项目技术栈

1. TypeScript programming language
2. Git
3. REST Api
4. 5G Chatbot / Rich Communication Service
5. 硬核桃社区 5G Chatbot SDK <https://www.5g-msg.com/#/bussinessInformation>

## Links

- 开源软件供应链点亮计划-暑期2021 - 支持电信运营商 5G Chatbot / RCS 项目
  - [开源软件供应链点亮计划 - 暑期2021](https://summer.iscas.ac.cn/)
  - [项目说明：开发支持电信运营商 5G Chatbot / RCS 的 Wechaty 接入 Puppet 模块](https://github.com/wechaty/summer/issues/74)
  - [OSPP 2021-期初报告-开发支持电信运营商5G Chatbot/RCS的 Wechaty接入Puppet模块](https://wechaty.js.org/2021/07/15/ospp-plan-5g-chatbot-puppet/)
  - [OSPP 2021-期中报告-开发支持电信运营商 5G Chatbot / RCS 的 Wechaty 接入 Puppet 模块](https://wechaty.js.org/2021/08/30/ospp-mid-term-5g-chatbot-puppet/)
  - [OSPP 2021-结项报告-开发支持电信运营商 5G Chatbot / RCS 的 Wechaty 接入 Puppet 模块](https://wechaty.js.org/2021/10/07/ospp-final-term-5g-chatbot-puppet/)
- [支持5G消息的 puppet-walnut 接入介绍](https://wechaty.js.org/2021/11/07/how-to-develop-wechaty-puppet-module-supporting-5g-messages/)
- [中国电信-中国联通 5G 消息业务平台行业客户接入接口技术规范 V1.0.4](https://github.com/wechaty/puppet-walnut/blob/main/docs/5g-message-service-platform-industry-customer-access-interface-specification.pdf)

## 相关链接

- [Wechaty](https://wechaty.js.org/v/zh/)
- [Koa](https://koa.bootcss.com/)
- [TypeScripts中文手册](https://www.tslang.cn/docs/handbook/basic-types.html)

## History

### main v1.11 (Nov 29, 2021)

1. Adapt to Wechaty v1.11

### v0.0.1 (Jun 27, 2018)

Initial version.

## Maintainer

- [Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), Tencent TVP of Chatbot, \<zixia@zixia.net\>

## COPYRIGHT & LICENSE

- Code & Docs © 2018 Huan LI \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
