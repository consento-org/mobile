import { User } from '../User'
import { Vault } from '../Vault'
import { Relation } from '../Relation'
import { autorun } from 'mobx'

describe('system', () => {
  it('starts', async () => {
    const user = new User({})
    const x = autorun(() => {
      console.log({ modelType: user.$modelType, modelId: user.$modelId })
      console.log(`autoran! ${user.vaults.size}`)
    })
    expect(user.$modelId).not.toBe(null)
    user.vaults.add(new Vault({}))
    user.relations.add(new Relation({
      
    }))
    x()
  })
})
