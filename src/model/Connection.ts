import { model, Model, tProp, types } from 'mobx-keystone'
import { IConnection, IReceiverJSON, ISenderJSON, IConnectionJSON } from '@consento/api'

@model('consento/Receiver')
export class Receiver extends Model({
  receiveKey: tProp(types.string),
  id: tProp(types.string)
}) implements IReceiverJSON {}

@model('consento/Sender')
export class Sender extends Model({
  id: tProp(types.string),
  sendKey: tProp(types.string),
  receiveKey: tProp(types.string)
}) implements ISenderJSON {}

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
}) implements IConnectionJSON {}
