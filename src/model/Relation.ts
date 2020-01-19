import { computed } from 'mobx'
import { model, tProp, Model, types, modelAction } from 'mobx-keystone'
import { IConsentoCrypto, IReceiver, ISender, IConnection } from '@consento/api'
import { Buffer } from '@consento/crypto/util/buffer'
import { Connection, fromIConnection } from './Connection'

// eslint-disable-next-line @typescript-eslint/require-await
export function fromConnection (connection: IConnection): Relation {
  return new Relation({
    name: null,
    connection: fromIConnection(connection)
  })
}

@model('consento/Relation')
export class Relation extends Model({
  name: tProp(types.maybeNull(types.string)),
  connection: tProp(types.model<Connection>(Connection))
}) {
  @computed get displayName (): string {
    if (this.name !== null && this.name !== '') {
      return this.name
    }
    return this.defaultName
  }

  @computed get defaultName (): string {
    const send = Buffer.from(this.connection.sender.sendKey, 'base64')
    const receive = Buffer.from(this.connection.receiver.receiveKey, 'base64')
    return `${send.readUInt16BE(0).toString(16)}-${send.readUInt16BE(1).toString(16)}-${receive.readUInt16BE(0).toString(16)}-${receive.readUInt16BE(1).toString(16)}`.toUpperCase()
  }

  @modelAction setName (name: string): void {
    this.name = name
  }

  receiver (crypto: IConsentoCrypto): IReceiver | null {
    return this.connection.receiver.receiver(crypto)
  }

  sender (crypto: IConsentoCrypto): ISender | null {
    return this.connection.sender.sender(crypto)
  }
}
