import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import { log } from 'wechaty-puppet'
import FlashStore from 'flash-store'
import PuppetWalnut from '../puppet-walnut.js'
import type { WalnutContactPayload, WalnutMessagePayload } from '../help/struct'

const PRE = 'CacheManager'

export default class CacheManager {

  /**
   * ************************************************************************
   *                Static Methods
   * ************************************************************************
   */
  private static _instance?: CacheManager

  private static baseDir = path.join(
    os.homedir(),
    path.sep,
    '.wechaty',
    path.sep,
    'puppet-walnut-cache',
    path.sep,
  )

  public static get Instance () {
    if (!this._instance) {
      throw new Error(`${PRE} cache manager instance not initialized.`)
    }
    return this._instance
  }

  public static async init () {
    log.verbose(PRE, 'init()')
    this.baseDir = path.join(this.baseDir, PuppetWalnut.sipId, path.sep)
    if (this._instance) {
      log.verbose(PRE, 'init() CacheManager has been initialized, no need to initialize again.')
      return
    }
    this._instance = new CacheManager()
    await this._instance.initCache()
    return CacheManager.Instance
  }

  public static async release () {
    log.verbose(PRE, 'release()')
    if (!this._instance) {
      log.verbose(PRE, 'release() CacheManager not exist, no need to release it.')
      return
    }
    await this._instance.releaseCache()
    this._instance = undefined
  }

  public static async initFlashStore (name: string) {
    const dir = path.join(this.baseDir, name)
    return new FlashStore(dir)
  }

  /**
   * ************************************************************************
   *                Instance Methods
   * ************************************************************************
   */

  private cacheMessageRawPayload?: FlashStore<string, WalnutMessagePayload>
  private cacheContactRawPayload?: FlashStore<string, WalnutContactPayload>

  /**
   * -------------------------------
   * Message Section
   * --------------------------------
   */

  public async getMessage (messageId: string): Promise<WalnutMessagePayload | undefined> {
    if (!this.cacheMessageRawPayload) {
      throw new Error(`${PRE} getMessage() has no cache.`)
    }
    log.verbose(PRE, `getMessage(${messageId})`)
    return await this.cacheMessageRawPayload.get(messageId)
  }

  public async setMessage (messageId: string, payload: WalnutMessagePayload): Promise<void> {
    if (!this.cacheMessageRawPayload || !messageId) {
      throw new Error(`${PRE} setMessage() has no cache.`)
    }
    log.verbose(PRE, `setMessage(${messageId}): ${JSON.stringify(payload)}`)
    await this.cacheMessageRawPayload.set(messageId, payload)
  }

  /**
   * -------------------------------
   * Contact Section
   * --------------------------------
   */
  public async getContact (contactId: string): Promise<WalnutContactPayload | undefined> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} getContact() has no cache.`)
    }
    log.verbose(PRE, `getContact(${contactId})`)
    return await this.cacheContactRawPayload.get(contactId)
  }

  public async setContact (contactId: string, payload: WalnutContactPayload): Promise<void> {
    if (!this.cacheContactRawPayload || !contactId) {
      throw new Error(`${PRE} setContact() has no cache.`)
    }
    log.verbose(PRE, `setContact(${contactId}): ${JSON.stringify(payload)}`)
    await this.cacheContactRawPayload.set(contactId, payload)
  }

  /**
   * -------------------------------
   * Private Method Section
   * --------------------------------
   */
  private async initCache (): Promise<void> {
    log.verbose(PRE, 'initCache()')

    if (this.cacheMessageRawPayload) {
      throw new Error('cache exists')
    }

    const baseDirExist = await fs.pathExists(CacheManager.baseDir)
    if (!baseDirExist) {
      await fs.mkdirp(CacheManager.baseDir)
    }

    this.cacheMessageRawPayload = await CacheManager.initFlashStore('messageRawPayload')
    this.cacheContactRawPayload = await CacheManager.initFlashStore('contactRawPayload')

    await this.cacheContactRawPayload.set(PuppetWalnut.chatbotId, { phone: PuppetWalnut.chatbotId })

    log.verbose(PRE, `initCache() cacheDir="${CacheManager.baseDir}"`)
  }

  private async releaseCache () {
    log.verbose(PRE, 'releaseCache()')

    if (this.cacheMessageRawPayload
      && this.cacheContactRawPayload
    ) {
      log.silly(PRE, 'releaseCache() closing caches ...')

      await Promise.all([
        this.cacheMessageRawPayload.close(),
        this.cacheContactRawPayload.close(),
      ])

      this.cacheMessageRawPayload = undefined
      this.cacheContactRawPayload = undefined

      log.silly(PRE, 'releaseCache() cache closed.')
    } else {
      log.verbose(PRE, 'releaseCache() cache not exist.')
    }
  }

}
