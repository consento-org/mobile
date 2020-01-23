import { Buffer } from 'buffer'

export function humanModelId (modelId: string): string {
  const idBuffer = Buffer.from(modelId, 'utf8')
  return `${idBuffer.readUInt16BE(0).toString(32)}${idBuffer.readUInt16BE(1).toString(32)}${idBuffer.readUInt16BE(2).toString(32)}${idBuffer.readUInt16BE(3).toString(32)}`
    .toUpperCase()
    .split(/(.{4})/g)
    .filter(Boolean)
    .join('-')
}
