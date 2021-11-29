import * as PUPPET  from 'wechaty-puppet';
import {initSever} from "./sever/sever";
import {config} from "./config";
import {updateToken} from "./help/request";
import {messageParse} from "./help/prase";
import type {message} from "./help/struct";
import {send} from "./help/message";

export type PuppetWalnutOptions = PUPPET.PuppetOptions & {
    sipId: string,
    appId: string,
    appKey: string,
}

class PuppetWalnut extends PUPPET.Puppet {

    static override readonly VERSION = "1.0.0"

    cacheMessagePayload : Map<string, PUPPET.payloads.Message>
    cacheContactPayload : Map<string, PUPPET.payloads.Contact>

    constructor(options: PuppetWalnutOptions) {
        super();
        config.sipId = options.sipId
        config.appId = options.appId
        config.appKey = options.appKey
        config.chatbotId = `sip:${config.sipId}@botplatform.rcs.chinaunicom.cn`
        config.base = `http://${config.serverRoot}/bot/${config.apiVersion}/${config.chatbotId}`
        this.cacheMessagePayload = new Map()
        this.cacheContactPayload = new Map()
        PUPPET.log.verbose('Puppet5g', 'constructor("%s")', JSON.stringify(options))
    }

    onStart(): Promise<void> {

        initSever(this).then(() => {
            PUPPET.log.info('Puppet5g-Sever', `Server running on port ${config.port}`);
        })

        updateToken()

        this.login(config.chatbotId)

        return Promise.resolve(undefined);
    }

    onStop(): Promise<void> {
        return Promise.resolve(undefined);
    }

    /**
     *
     * Message
     *
     */
    override async messageRawPayloadParser(payload: PUPPET.payloads.Message) {
        return payload
    }

    override async messageRawPayload(id: string): Promise<PUPPET.payloads.Message> {
        PUPPET.log.verbose('Puppet5g', 'messageRawPayload(%s)', id)
        return this.cacheMessagePayload.get(id)!
    }

    override async messageSendText(to: string, msg: string) {
        send(to, msg)
        PUPPET.log.info(`send message to ${to}: `,msg)
    }

    onMessage(message: message){
        const msg: PUPPET.payloads.Message = messageParse(message)
        this.cacheMessagePayload.set(message.messageId, msg)
        this.emit("message", {messageId: message.messageId})
    }

    /**
     *
     * Contact
     *
     */
    override async contactRawPayloadParser (payload: PUPPET.payloads.Contact) { return payload }
    override async contactRawPayload (id: string): Promise<PUPPET.payloads.Contact> {
        PUPPET.log.verbose('Puppet5g', 'contactRawPayload(%s)', id)
        return this.cacheContactPayload.get(id)!
    }
}

export default PuppetWalnut
