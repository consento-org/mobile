import { model, Model, tProp, types } from 'mobx-keystone'

@model('consento/VaultData')
export class VaultData extends Model({
  secretKeyBase64: tProp(types.string),
  dataKeyHex: tProp(types.string)
}) {

}
