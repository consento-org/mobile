import { computed } from 'mobx'
import { model, tProp, Model, types, modelAction, Ref, customRef } from 'mobx-keystone'
import { IConsentoCrypto, IReceiver, ISender, IConnection } from '@consento/api'
import { Buffer } from '@consento/crypto/util/buffer'
import { Connection, fromIConnection } from './Connection'
import { findParentUser } from './User'

// eslint-disable-next-line @typescript-eslint/require-await
export async function fromConnection (connection: IConnection): Promise<Relation> {
  return new Relation({
    name: null,
    connection: await fromIConnection(connection)
  })
}

export const relationRefInUser = customRef<Relation>('consento/Relation#inUser', {
  resolve (ref: Ref<Relation>): Relation {
    return findParentUser(ref)?.findRelation(ref.id)
  }
})

@model('consento/Relation')
export class Relation extends Model({
  name: tProp(types.maybeNull(types.string)),
  connection: tProp(types.model<Connection>(Connection))
}) {
  onAttachedToRootStore (): void {
    console.log(`Attached: ${this.$modelType}#${this.$modelId}`)
  }

  @computed get displayName (): string {
    if (this.name !== null) {
      return this.name
    }
    return this.defaultName
  }

  @computed get defaultName (): string {
    const send = Buffer.from(this.connection.sendKey, 'base64')
    const receive = Buffer.from(this.connection.receiveKey, 'base64')
    return `${send.readUInt16BE(0).toString(16)}-${send.readUInt16BE(1).toString(16)}-${receive.readUInt16BE(0).toString(16)}-${receive.readUInt16BE(1).toString(16)}`.toUpperCase()
  }

  @modelAction setName (name: string): void {
    this.name = name
  }

  receiver (crypto: IConsentoCrypto): IReceiver | null {
    return this.connection.receiver(crypto)
  }

  sender (crypto: IConsentoCrypto): ISender | null {
    return this.connection.sender(crypto)
  }
}
