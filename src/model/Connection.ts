import { model, Model, tProp, types } from 'mobx-keystone'
import { IReceiver, IConnection, ISender } from '@consento/api'
import { requireAPI } from './Consento.types'
import { computed } from 'mobx'

@model('consento/Receiver')
export class Receiver extends Model({
  receiveKey: tProp(types.string),
  id: tProp(types.string)
}) {
  @computed get receiver (): IReceiver {
    const { crypto } = requireAPI(this)
    return new crypto.Receiver({
      id: this.id,
      receiveKey: this.receiveKey
    })
  }
}

@model('consento/Sender')
export class Sender extends Model({
  id: tProp(types.string),
  sendKey: tProp(types.string),
  receiveKey: tProp(types.string)
}) {
  @computed get sender (): ISender {
    const { crypto } = requireAPI(this)
    return new crypto.Sender({
      id: this.id,
      receiveKey: this.receiveKey,
      sendKey: this.sendKey
    })
  }
}

export function fromIConnection (connection: IConnection): Connection {
  const newConnection = new Connection({
    sender: new Sender(connection.sender.toJSON()),
    receiver: new Receiver(connection.receiver.toJSON())
  })
  return newConnection
}

@model('consento/Connection')
export class Connection extends Model({
  sender: tProp(types.model<Sender>(Sender)),
  receiver: tProp(types.model<Receiver>(Receiver))
}) {
  @computed get connection (): IConnection {
    return {
      sender: this.sender.sender,
      receiver: this.receiver.receiver
    }
  }
}
