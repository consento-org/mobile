import { computed } from 'mobx'
import { model, tProp, Model, types, modelAction } from 'mobx-keystone'
import { IConnection } from '@consento/api'
import { Connection, fromIConnection } from './Connection'
import { humanModelId } from '../util/humanModelId'
import { ISortable } from '../util/compareNames'
import { IRelationEntry } from './Consento.types'

// eslint-disable-next-line @typescript-eslint/require-await
export function fromConnection (connection: IConnection): Relation {
  return new Relation({
    name: null,
    connection: fromIConnection(connection)
  })
}

@model('consento/Relation')
export class Relation extends Model({
  name: tProp(types.maybeNull(types.string), () => null),
  avatarId: tProp(types.maybeNull(types.string), () => null),
  connection: tProp(types.model<Connection>(Connection))
}) implements ISortable, IRelationEntry {
  @computed get displayName (): string {
    return this.name === '' ? this.humanId : this.name ?? this.humanId
  }

  get relationId (): string {
    return this.$modelId
  }

  @computed get sortBy (): string {
    return this.name ?? this.humanId
  }

  @computed get humanId (): string {
    return humanModelId(this.$modelId)
  }

  @modelAction setName (name: string | null): void {
    this.name = name
  }

  @modelAction setAvatarId (avatarId: string | null): void {
    this.avatarId = avatarId
  }
}
