import React from 'react'
import Svg, { Circle, Image } from 'react-native-svg'
import { Buffer, bufferToString } from '@consento/api/util'
import { ImageAsset } from '../../styles/design/ImageAsset'
import { SketchImage } from '../../styles/util/react/SketchImage'
import { Placement } from '../../styles/util/Placement'
import { Color } from '../../styles/design/Color'
import { IImageAsset } from '../../styles/util/types'
import { exists } from '../../styles/util/lang'

function combine <T, TKeys extends string> (separate: Record<TKeys, T[]>): Array<Record<TKeys, T>> {
  type TResult = Array<Record<TKeys, T>> | null
  let result: TResult = null
  let first: string = ''
  for (const [key, list] of Object.entries<T[]>(separate)) {
    if (result === null) {
      first = key
      result = list.map(entry => {
        return {
          [key]: entry
        }
      }) as TResult
    } else {
      if (list.length !== result.length) {
        throw new Error(`We got more "${first}" entries than "${key}" entries.`)
      }
      for (let i = 0; i < result.length; i++) {
        (result[i] as any)[key] = list[i]
      }
    }
  }
  return result ?? []
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
const hairs = combine <IImageAsset, 'below' | 'above'>({
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
  avatarId: string | null | undefined
  size: number
}

export const Avatar = ({ avatarId, size }: IAvatarProps): JSX.Element => {
  if (!exists(avatarId)) {
    return <SketchImage src={ImageAsset.avatarUnknown} style={{ width: size, height: size }} />
  }
  const buffer = Buffer.from(avatarId, 'hex')
  const hair = hairs[buffer.readUInt16LE(1)]
  const face = faces[buffer.readUInt16LE(3)]
  const nose = noses[buffer.readUInt16LE(5)]
  const mouth = mouths[buffer.readUInt16LE(7)]
  const eye = eyes[buffer.readUInt16LE(9)]
  const color = colors[buffer.readUInt16LE(11)]
  return <Svg width={size} height={size} viewBox={`0 0 ${size.toString()} ${size.toString()}`}>
    <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
    <Image href={hair.below.source()} width={size} height={size} />
    <Image href={face.source()} width={size} height={size} />
    <Image href={eye.source()} width={size} height={size} />
    <Image href={nose.source()} width={size} height={size} />
    <Image href={mouth.source()} width={size} height={size} />
    <Image href={hair.above.source()} width={size} height={size} />
  </Svg>
}
