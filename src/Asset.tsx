// This file has been generated with expo-export, a Sketch plugin.
import React from 'react'
import { Image, ImageStyle } from 'react-native'

class Assets {
  cache: { [key: string]: Asset } = {}

  fetch (key: string, load: () => any): Asset {
    let result = this.cache[key]
    if (result === undefined) {
      result = new Asset(load())
      this.cache[key] = result
    }
    return result
  }
}

const assets = new Assets ()

export class Asset {
  data: any
  constructor (data: any) {
    this.data = data
  }
  img (style?: ImageStyle) {
    return <Image source={ this.data } style={ style } />
  }
  static elementWelcome () {
    return assets.fetch('elementWelcome', () => require('../assets/element/welcome.png'))
  }
  static iconVaultBigOpen () {
    return assets.fetch('iconVaultBigOpen', () => require('../assets/icon/vault/big/open.png'))
  }
  static iconVaultBigClosed () {
    return assets.fetch('iconVaultBigClosed', () => require('../assets/icon/vault/big/closed.png'))
  }
  static iconRelationsIdle () {
    return assets.fetch('iconRelationsIdle', () => require('../assets/icon/relations/idle.png'))
  }
  static iconConsentoIdle () {
    return assets.fetch('iconConsentoIdle', () => require('../assets/icon/consento/idle.png'))
  }
  static iconVaultIdle () {
    return assets.fetch('iconVaultIdle', () => require('../assets/icon/vault/idle.png'))
  }
  static iconVaultActive () {
    return assets.fetch('iconVaultActive', () => require('../assets/icon/vault/active.png'))
  }
  static iconConsentoActive () {
    return assets.fetch('iconConsentoActive', () => require('../assets/icon/consento/active.png'))
  }
  static iconRelationsActive () {
    return assets.fetch('iconRelationsActive', () => require('../assets/icon/relations/active.png'))
  }
  static elementIconLockWhiteClose () {
    return assets.fetch('elementIconLockWhiteClose', () => require('../assets/element/icon/lock-white/close.png'))
  }
  static iconLogo () {
    return assets.fetch('iconLogo', () => require('../assets/icon/logo.png'))
  }
  static iconDeleteGrey () {
    return assets.fetch('iconDeleteGrey', () => require('../assets/icon/delete/grey.png'))
  }
  static iconEditGrey () {
    return assets.fetch('iconEditGrey', () => require('../assets/icon/edit/grey.png'))
  }
  static iconBackGrey () {
    return assets.fetch('iconBackGrey', () => require('../assets/icon/back/grey.png'))
  }
  static elementCardVaultBackground () {
    return assets.fetch('elementCardVaultBackground', () => require('../assets/element/card/vault/background.png'))
  }
}
