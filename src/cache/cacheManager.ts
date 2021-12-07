import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import { log } from 'wechaty-puppet'
import FlashStore from 'flash-store'
import type { WalnutMessagePayload } from '../help/struct'

const PRE = 'CacheManager'

export default class CacheManager {

  /**
   * ************************************************************************
   *                Static Methods
   * ************************************************************************
   */
  private static _instance?: CacheManager

  private static baseDir = path.join(
    os.homedir(), path.sep,
    '.wechaty', path.sep,
    'puppet-walnut-cache', path.sep,
  )

  public static get Instance () {
    if (!this._instance) {
      throw new Error(`${PRE} cache manager instance not initialized.`)
    }
    return this._instance
  }

  public static async init (userId: string) {
    log.verbose(PRE, 'init()')
    this.baseDir = path.join(this.baseDir, path.sep, userId)
    if (this._instance) {
      log.verbose(PRE, 'init() CacheManager has been initialized, no need to initialize again.')
      return
    }
    this._instance = new CacheManager()
    await this._instance.initCache()
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

  public static async initFlashStore (baseDir: string, name: string) {
    const dir = path.join(baseDir, path.sep, name)
    return new FlashStore(dir)
  }

  /**
   * ************************************************************************
   *                Instance Methods
   * ************************************************************************
   */

  private cacheMessageRawPayload?: FlashStore<string, WalnutMessagePayload>
  private cacheContactRawPayload?: FlashStore<string, WalnutMessagePayload>

  /**
   * -------------------------------
   * Message Section
   * --------------------------------
   */

  public async getMessage (messageId: string): Promise<WalnutMessagePayload | undefined> {
    if (!this.cacheMessageRawPayload) {
      throw new Error(`${PRE} getMessage() has no cache.`)
    }
    return await this.cacheMessageRawPayload.get(messageId)
  }

  public async setMessage (messageId: string, payload: WalnutMessagePayload): Promise<void> {
    if (!this.cacheMessageRawPayload || !messageId) {
      throw new Error(`${PRE} setMessage() has no cache.`)
    }
    await this.cacheMessageRawPayload.set(messageId, payload)
  }

  /**
   * -------------------------------
   * Contact Section
   * --------------------------------
   */
  public async getContact (contactId: string): Promise<WalnutMessagePayload | undefined> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} getMessage() has no cache.`)
    }
    return await this.cacheContactRawPayload.get(contactId)
  }

  public async setContact (contactId: string, payload: WalnutMessagePayload): Promise<void> {
    if (!this.cacheContactRawPayload || !contactId) {
      throw new Error(`${PRE} setMessage() has no cache.`)
    }
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

    this.cacheMessageRawPayload = await CacheManager.initFlashStore(CacheManager.baseDir, 'messageRawPayload')
    this.cacheContactRawPayload = await CacheManager.initFlashStore(CacheManager.baseDir, 'contactRawPayload')
    // this.cacheContactRawPayload        = puppetCache.genContactClient()
    // this.cacheRoomMemberRawPayload     = puppetCache.genRoomMemberClient()
    // this.cacheRoomRawPayload           = puppetCache.genRoomClient()
    // this.cacheFriendshipRawPayload     = puppetCache.genFriendshipClient()
    // this.cacheRoomInvitationRawPayload = puppetCache.genRoomInvitationClient()
    // const contactTotal = this.cacheContactRawPayload?.size

    // log.verbose(PRE, `initCache() inited ${contactTotal} Contacts,  cachedir="${baseDir}"`)
  }

  private async releaseCache () {
    log.verbose(PRE, 'releaseCache()')

    // if (this.cacheContactRawPayload
    //   && this.cacheRoomMemberRawPayload
    //   && this.cacheRoomRawPayload
    //   && this.cacheFriendshipRawPayload
    //   && this.cacheRoomInvitationRawPayload
    //   && this.cacheImageMessageRawPayload
    // ) {
    //   log.silly(PRE, 'releaseCache() closing caches ...')
    //
    //   if (this.compactCacheTimer) {
    //     clearTimeout(this.compactCacheTimer)
    //     this.compactCacheTimer = undefined
    //   }
    //
    //   await Promise.all([
    //     this.cacheContactRawPayload.close(),
    //     this.cacheRoomMemberRawPayload.close(),
    //     this.cacheRoomRawPayload.close(),
    //     this.cacheFriendshipRawPayload.close(),
    //     this.cacheRoomInvitationRawPayload.close(),
    //     this.cacheImageMessageRawPayload.close(),
    //   ])
    //
    //   this.cacheContactRawPayload    = undefined
    //   this.cacheRoomMemberRawPayload = undefined
    //   this.cacheRoomRawPayload       = undefined
    //   this.cacheFriendshipRawPayload = undefined
    //   this.cacheRoomInvitationRawPayload = undefined
    //   this.cacheImageMessageRawPayload = undefined
    //
    //   log.silly(PRE, 'releaseCache() cache closed.')
    // } else {
    //   log.verbose(PRE, 'releaseCache() cache not exist.')
    // }
  }

}
