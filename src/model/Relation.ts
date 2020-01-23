import { computed } from 'mobx'
import { model, tProp, Model, types, modelAction } from 'mobx-keystone'
import { IConnection } from '@consento/api'
import { Connection, fromIConnection } from './Connection'
import { humanModelId } from '../util/humanModelId'

// eslint-disable-next-line @typescript-eslint/require-await
export function fromConnection (connection: IConnection): Relation {
  return new Relation({
    name: null,
    connection: fromIConnection(connection)
  })
}

@model('consento/Relation')
export class Relation extends Model({
  name: tProp(types.string, () => ''),
  connection: tProp(types.model<Connection>(Connection))
}) {
  @computed get displayName (): string {
    if (this.name === '') {
      return this.humanId
    }
    return this.name
  }

  @computed get sortBy (): string {
    return this.name ?? this.humanId
  }

  @computed get humanId (): string {
    return humanModelId(this.$modelId)
  }

  @modelAction setName (name: string): void {
    this.name = name
  }
}
