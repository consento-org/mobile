import { model, tProp, Model, types } from 'mobx-keystone'
import { IConsentoCrypto } from '@consento/api'
import { Connection } from './Connection'

export const MODEL = 'consento/Relation'

@model(MODEL)
export class Relation extends Model({
  name: tProp(types.maybeNull(types.string)),
  connection: tProp(types.model<Connection>(Connection))
}) {
  onAttachedToRootStore () {
    console.log(`Attached: ${this.$modelType}#${this.$modelId}`)
  }
  receiver (crypto: IConsentoCrypto) {
    if (this.connection !== null) {
      return this.connection.receiver(crypto)
    }
    return null
  }
  sender (crypto: IConsentoCrypto) {
    if (this.connection !== null) {
      return this.connection.sender(crypto)
    }
    return null
  }
}
