import { model, tProp, Model, types } from 'mobx-keystone'
import { IConsentoCrypto, IReceiver, ISender, IConnection } from '@consento/api'
import { Connection, fromIConnection } from './Connection'

export const MODEL = 'consento/Relation'

// eslint-disable-next-line @typescript-eslint/require-await
export async function fromConnection (connection: IConnection): Promise<Relation> {
  return new Relation({
    name: null,
    connection: await fromIConnection(connection)
  })
}

@model(MODEL)
export class Relation extends Model({
  name: tProp(types.maybeNull(types.string)),
  connection: tProp(types.model<Connection>(Connection))
}) {
  onAttachedToRootStore (): void {
    console.log(`Attached: ${this.$modelType}#${this.$modelId}`)
  }

  receiver (crypto: IConsentoCrypto): IReceiver | null {
    if (this.connection !== null) {
      return this.connection.receiver(crypto)
    }
    return null
  }

  sender (crypto: IConsentoCrypto): ISender | null {
    if (this.connection !== null) {
      return this.connection.sender(crypto)
    }
    return null
  }
}
