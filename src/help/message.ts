import {post} from "./request";
import {api} from "./Api";
import stringRandom from "string-random";
import {config} from "../config";

export function send(to: string, msg: string) {
    post(api.sendMessage, {
        "messageId": stringRandom(20),
        "messageList": [
            {
                "contentType": "text/plain",
                "contentEncoding": "utf8",
                "contentText": msg
            }
        ],
        "destinationAddress": [`tel:+86${to}`],
        "senderAddress": config.chatbotId,
        "serviceCapabilit": [
            {
                "capabilityId": "ChatbotSA",
                "version": "+g.gsma.rcs.botversion=\"#=1\""
            }
        ],
        "conversationId": "XSFDSFDFSAFDSAS^%",
        "contributionId": "SFF$#REGFY7&^%THT"
    }).then(res => {
            console.log(res.data.messageId)
        }
    )

    // post(api.sendMessage, {
    //         "messageId": stringRandom(20),
    //         "messageList": [
    //             {
    //                 "contentType": "text/plain",
    //                 "contentText": msg
    //             },
    //             {
    //                 "contentType": "application/vnd.gsma.botsuggestion.v1.0+json",
    //                 "contentText": {
    //                     "suggestions": [
    //                         {
    //                             "reply": {
    //                                 "displayText": "Yes",
    //                                 "postback": {
    //                                     "data": "set_by_chatbot_reply_yes"
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             "reply": {
    //                                 "displayText": "No",
    //                                 "postback": {
    //                                     "data": "set_by_chatbot_reply_no"
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             "action": {
    //                                 "urlAction": {
    //                                     "openUrl": {
    //                                         "url": "https://www.10010.com"
    //                                     }
    //                                 },
    //                                 "displayText": "Open website or deep link",
    //                                 "postback": {
    //                                     "data": "set_by_chatbot_open_url"
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             "action": {
    //                                 "dialerAction": {
    //                                     "dialPhoneNumber": {
    //                                         "phoneNumber": "+8617928222350"
    //                                     }
    //                                 },
    //                                 "displayText": "Call a phone number",
    //                                 "postback": {
    //                                     "data": "set_by_chatbot_open_dialer"
    //                                 }
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }
    //         ],
    //         "destinationAddress": [
    //             `tel:+86${to}`
    //         ],
    //         "smsSupported": false,
    //         "storeSupported": false,
    //         "senderAddress": config.chatbotId,
    //         "serviceCapability": [
    //             {
    //                 "capabilityId": "ChatbotSA",
    //                 "version": "+g.gsma.rcs.botversion=\"#=1\""
    //             }
    //         ],
    //         "conversationId": "XSFDSFDFSAFDSAS^%",
    //         "contributionId": "SFF$#REGFY7&^%THT"
    //     }
    // )


    // post(api.sendMessage, {
    //         "messageId": stringRandom(20),
    //         "messageList": [
    //             {
    //                 "contentType": "text/plain",
    //                 "contentText": "geo:50.7311865,7.0914591;crs=gcj02;u=10;rcs-l=Qingfeng%20Steamed%20Dumpling%20Shop %20%F0%9F%8D%9A"
    //             }
    //         ],
    //         "destinationAddress": [`tel:+86${to}`],
    //         "smsSupported": false,
    //         "storeSupported": false,
    //         "senderAddress": config.chatbotId,
    //         "serviceCapability": [{"capabilityId": "ChatbotSA", "version": "+g.gsma.rcs.botversion=\"#=1\""}],
    //         "conversationId": "XSFDSFDFSAFDSAS^%",
    //         "contributionId": "SFF$#REGFY7&^%THT"
    //     }
    // )
}

export function revoke(){
    post(api.revokeMessage, {
        "messageId": "VqHUSH8qbWFQDlqAGns",
        "destinationAddress": [`tel:+8613911833788`],
        "status": "RevokeRequested",
    }).then(res => {
            console.log(res.data)
        }
    )
}
