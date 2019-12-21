import { computed } from 'mobx'
import { model, Model, tProp, types } from 'mobx-keystone'
import { IConsentoCrypto } from '@consento/api'

@model('consento/Receiver')
export class Receiver extends Model({
  receiveKey: tProp(types.string)
}) {
  @computed receiver (crypto: IConsentoCrypto) {
      
    return new crypto.Receiver({ receiveKey: this.receiveKey })
  }
}

@model('consento/Sender')
export class Sender extends Model({
  sendKey: tProp(types.string)
}) {
  @computed sender (crypto: IConsentoCrypto) {
    return new crypto.Sender({ sendKey: this.sendKey })
  }
}

@model('consento/Connection')
export class Connection extends Model({
  sendKey: tProp(types.string),
  receiveKey: tProp(types.string)
}) {
  @computed connection (crypto: IConsentoCrypto) {
    return {
      sender: new crypto.Sender({ sendKey: this.sendKey }),
      receiver: new crypto.Receiver({ receiveKey: this.receiveKey })
    }
  }
  sender (crypto: IConsentoCrypto) {
    return this.connection(crypto).sender
  }
  receiver (crypto: IConsentoCrypto) {
    return this.connection(crypto).receiver
  }
}
