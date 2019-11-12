// This file has been generated with expo-export, a Sketch plugin.
import React from 'react'
import { Image, ImageStyle, View, ViewStyle, ImageSourcePropType } from 'react-native'

class Cache<Type, Args> {
  cache: { [key: string]: Type } = {}
  clazz: { new (Args): Type }

  constructor (clazz: { new (Args: Args): Type }) {
    this.clazz = clazz
  }

  fetch (key: string, load: () => Args): Type {
    let result = this.cache[key]
    if (result === undefined) {
      result = new this.clazz(load())
      this.cache[key] = result
    }
    return result
  }
}

export class ImageAsset {
  source: ImageSourcePropType

  constructor (source: ImageSourcePropType) {
    this.source = source
  }

  img (style?: ImageStyle) {
    return <Image source={ this.source } style={ style } />
  }
}

export interface Slice9Args {
  w: number
  h: number
  slice: {
    x: number
    y: number
    w: number
    h: number
  }
  slices: ImageSourcePropType[]
}

const rowsStyle: ViewStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'row'
}

export class Slice9 {
  width: number
  height: number
  _rows: ViewStyle[]
  _columsStyle: ViewStyle
  _styles: ImageStyle[]
  _slices: ImageSourcePropType[]

  constructor ({ w, h, slice, slices }: Slice9Args) {
    this.width = w
    this.height = h
    const x = (slice.x + 0.5) | 0
    const y = (slice.y + 0.5) | 0
    const right = (w - x - slice.w + 0.5) | 0
    const bottom = (h - y - slice.h + 0.5) | 0
    this._columsStyle = {
      display: 'flex',
      width: w,
      height: h,
      flexDirection: 'column'
    }
    this._rows = [{
      ...rowsStyle,
      height: y
    }, {
      ...rowsStyle,
      flexGrow: 1
    }, {
      ...rowsStyle,
      height: bottom
    }].map((rowStyle: ViewStyle) => Object.freeze(rowStyle))
    this._styles = [
      { width: x, height: y },
      { flexGrow: 1, height: y },
      { width: right, height: y },
      { width: x, height: '100%' },
      { flexGrow: 1, height: '100%', borderWidth: 1 },
      { width: right, height: '100%' },
      { width: x, height: bottom },
      { flexGrow: 1, height: bottom },
      { width: right, height: bottom }
    ].map((style: ImageStyle) => {
      // Causes images to flicker on first render
      // It looks weird if only the streched images flicker.
      style.resizeMode = 'stretch'
      return Object.freeze(style)
    })
    if (slices.length !== 9) {
      throw new Error('For a slice-9 we need 9 resources!')
    }
    this._slices = slices
  }

  render (style?: ViewStyle) {
    if (style === null || style === undefined) {
      style = this._columsStyle
    } else {
      style = {
        ...this._columsStyle,
        ...style
      }
    }
    return <View style={ style }>
      <View style={ this._rows[0] }>
        <Image source={ this._slices[0] } style={ this._styles[0] } fadeDuration={ 0 } />
        <Image source={ this._slices[1] } style={ this._styles[1] } fadeDuration={ 0 } />
        <Image source={ this._slices[2] } style={ this._styles[2] } fadeDuration={ 0 } />
      </View>
      <View style={ this._rows[1] }>
        <Image source={ this._slices[3] } style={ this._styles[3] } fadeDuration={ 0 } />
        <Image source={ this._slices[4] } style={ this._styles[4] } fadeDuration={ 0 } />
        <Image source={ this._slices[5] } style={ this._styles[5] } fadeDuration={ 0 } />
      </View>
      <View style={ this._rows[2] }>
        <Image source={ this._slices[6] } style={ this._styles[6] } fadeDuration={ 0 } />
        <Image source={ this._slices[7] } style={ this._styles[7] } fadeDuration={ 0 } />
        <Image source={ this._slices[8] } style={ this._styles[8] } fadeDuration={ 0 } />
      </View>
    </View>
  }
}

const images = new Cache<ImageAsset, ImageSourcePropType> (ImageAsset)
const slice9s = new Cache<Slice9, Slice9Args> (Slice9)

export const Asset = {
  elementWelcome () {
    return images.fetch('elementWelcome', () => require('../assets/element/welcome.png'))
  },
  iconVaultBigOpen () {
    return images.fetch('iconVaultBigOpen', () => require('../assets/icon/vault/big/open.png'))
  },
  iconVaultBigClosed () {
    return images.fetch('iconVaultBigClosed', () => require('../assets/icon/vault/big/closed.png'))
  },
  iconRelationsIdle () {
    return images.fetch('iconRelationsIdle', () => require('../assets/icon/relations/idle.png'))
  },
  iconConsentoIdle () {
    return images.fetch('iconConsentoIdle', () => require('../assets/icon/consento/idle.png'))
  },
  iconVaultIdle () {
    return images.fetch('iconVaultIdle', () => require('../assets/icon/vault/idle.png'))
  },
  iconVaultActive () {
    return images.fetch('iconVaultActive', () => require('../assets/icon/vault/active.png'))
  },
  iconConsentoActive () {
    return images.fetch('iconConsentoActive', () => require('../assets/icon/consento/active.png'))
  },
  iconRelationsActive () {
    return images.fetch('iconRelationsActive', () => require('../assets/icon/relations/active.png'))
  },
  elementIconLockWhiteClose () {
    return images.fetch('elementIconLockWhiteClose', () => require('../assets/element/icon/lock-white/close.png'))
  },
  iconLogo () {
    return images.fetch('iconLogo', () => require('../assets/icon/logo.png'))
  },
  iconDeleteGrey () {
    return images.fetch('iconDeleteGrey', () => require('../assets/icon/delete/grey.png'))
  },
  iconEditGrey () {
    return images.fetch('iconEditGrey', () => require('../assets/icon/edit/grey.png'))
  },
  iconBackGrey () {
    return images.fetch('iconBackGrey', () => require('../assets/icon/back/grey.png'))
  },
  x2aColorCoral () {
    return images.fetch('x2aColorCoral', () => require('../assets/x2a-color/coral.png'))
  },
  elementCardVaultBackground () {
    return images.fetch('elementCardVaultBackground', () => require('../assets/element/card/vault/background.png'))
  },
  buttonBackgroundEnabled () {
    return slice9s.fetch('buttonBackgroundEnabled', () => ({
      w: 55, h: 48, slice: { x: 24, y: 21, w: 8, h: 8 },
      slices: [
        require('../assets/button/background/enabled-0-0.png'),
        require('../assets/button/background/enabled-0-1.png'),
        require('../assets/button/background/enabled-0-2.png'),
        require('../assets/button/background/enabled-1-0.png'),
        require('../assets/button/background/enabled-1-1.png'),
        require('../assets/button/background/enabled-1-2.png'),
        require('../assets/button/background/enabled-2-0.png'),
        require('../assets/button/background/enabled-2-1.png'),
        require('../assets/button/background/enabled-2-2.png')
      ]
    }))
  }
}
