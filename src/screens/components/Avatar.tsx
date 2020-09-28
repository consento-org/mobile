import React from 'react'
import Svg, { Circle, Image } from 'react-native-svg'
import { Buffer } from 'buffer'
import { bufferToString } from '@consento/crypto/util/buffer'
import { exists } from '@consento/api/util'
import { ImageAsset } from '../../styles/design/ImageAsset'
import { SketchImage } from '../../styles/util/react/SketchImage'
import { Placement } from '../../styles/util/Placement'
import { Color } from '../../styles/design/Color'
import { IImageAsset } from '../../styles/util/types'

function combine <T, TB> (separate: { [key: string]: T[] }): TB[] {
  const keys = Object.keys(separate)
  let result
  let first: string
  for (const key of keys) {
    const list = separate[key]
    if (result === undefined) {
      first = key
      result = list.map(entry => {
        return {
          [key]: entry
        }
      })
    } else {
      if (list.length !== result.length) {
        throw new Error(`We got more "${first}" entries than "${key}" entries.`)
      }
      for (let i = 0; i < result.length; i++) {
        result[i][key] = list[i]
      }
    }
  }
  return result
}

function matchingProperties <T> (item: any, reg: RegExp): T[] {
  return Object.keys(item).filter(key => reg.test(key)).map(key => item[key])
}

function randomIndex (list: any[]): number {
  const index = (list.length * Math.random()) | 0
  return index % list.length
}

const faces = matchingProperties <IImageAsset>(ImageAsset, /^avatarFace/)
const noses = matchingProperties <IImageAsset>(ImageAsset, /^avatarNose/)
const mouths = matchingProperties <IImageAsset>(ImageAsset, /^avatarMouth/)
const eyes = matchingProperties <IImageAsset>(ImageAsset, /^avatarEyes/)
const colors = matchingProperties <string>(Color, /^avatar/)
const hairs = combine <IImageAsset, { below: IImageAsset, above: IImageAsset }>({
  above: matchingProperties(ImageAsset, /^avatarHairAbove/),
  below: matchingProperties(ImageAsset, /^avatarHairBelow/)
})

export function randomAvatarId (): string {
  const buffer = Buffer.alloc(13)
  buffer[0] = 1
  buffer.writeUInt16LE(randomIndex(hairs), 1)
  buffer.writeUInt16LE(randomIndex(faces), 3)
  buffer.writeUInt16LE(randomIndex(noses), 5)
  buffer.writeUInt16LE(randomIndex(mouths), 7)
  buffer.writeUInt16LE(randomIndex(eyes), 9)
  buffer.writeUInt16LE(randomIndex(colors), 11)
  return bufferToString(buffer, 'hex')
}

const combinations = hairs.length * faces.length * noses.length * mouths.length * eyes.length * colors.length

console.log(`${combinations.toString()} possible Avatar combinations`)

export interface IAvatarProps {
  avatarId: string
  place: Placement
}

export const Avatar = ({ avatarId, place }: IAvatarProps): JSX.Element => {
  if (!exists(avatarId)) {
    return <SketchImage src={ImageAsset.avatarUnknown} />
  }
  const buffer = Buffer.from(avatarId, 'hex')
  const hair = hairs[buffer.readUInt16LE(1)]
  const face = faces[buffer.readUInt16LE(3)]
  const nose = noses[buffer.readUInt16LE(5)]
  const mouth = mouths[buffer.readUInt16LE(7)]
  const eye = eyes[buffer.readUInt16LE(9)]
  const color = colors[buffer.readUInt16LE(11)]
  const { width: size } = place
  return <Svg width={size} height={size} viewBox={`0 0 ${size.toString()} ${size.toString()}`} style={{ position: 'absolute', left: place.left, top: place.top }}>
    <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
    <Image href={hair.below.source()} width={size} height={size} />
    <Image href={face.source()} width={size} height={size} />
    <Image href={eye.source()} width={size} height={size} />
    <Image href={nose.source()} width={size} height={size} />
    <Image href={mouth.source()} width={size} height={size} />
    <Image href={hair.above.source()} width={size} height={size} />
  </Svg>
}
