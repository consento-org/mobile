import { computed } from 'mobx'
import { model, Model, tProp, types } from 'mobx-keystone'
import { IConsentoCrypto, IReceiver, IConnection, ISender } from '@consento/api'

@model('consento/Receiver')
export class Receiver extends Model({
  receiveKey: tProp(types.string)
}) {
  @computed receiver (crypto: IConsentoCrypto): IReceiver {
    return new crypto.Receiver({ receiveKey: this.receiveKey })
  }
}

@model('consento/Sender')
export class Sender extends Model({
  sendKey: tProp(types.string)
}) {
  @computed sender (crypto: IConsentoCrypto): ISender {
    return new crypto.Sender({ sendKey: this.sendKey })
  }
}
export async function fromIConnection (connection: IConnection): Promise<Connection> {
  return new Connection({
    sendKey: await connection.sender.idBase64(),
    receiveKey: await connection.receiver.idBase64()
  })
}

@model('consento/Connection')
export class Connection extends Model({
  sendKey: tProp(types.string),
  receiveKey: tProp(types.string)
}) {
  @computed connection (crypto: IConsentoCrypto): IConnection {
    return {
      sender: new crypto.Sender({ sendKey: this.sendKey }),
      receiver: new crypto.Receiver({ receiveKey: this.receiveKey })
    }
  }

  sender (crypto: IConsentoCrypto): ISender {
    return this.connection(crypto).sender
  }

  receiver (crypto: IConsentoCrypto): IReceiver {
    return this.connection(crypto).receiver
  }
}
