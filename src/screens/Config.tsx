import React, { useState, useContext } from 'react'
import { View, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { InputField } from './components/InputField'
import { elementConfig } from '../styles/component/elementConfig'
import { BottomButtonView } from './components/BottomButtonView'
import { TNavigation, withNavigation } from './navigation'
import { useForm } from '../util/useForm'
import isURL from 'is-url-superb'
import { ConsentoButton } from './components/ConsentoButton'
import { ConsentoContext } from '../model/Consento'
import { observer } from 'mobx-react'

export const Config = withNavigation(observer(
  ({ navigation }: { navigation: TNavigation }): JSX.Element => {
    const [resetBarrier, setBarrier] = useState(true)
    const { config, updateConfig, deleteEverything } = useContext(ConsentoContext)
    const { leave, save, useField } = useForm(navigation,
      (config) => {
        setTimeout(() => {
          try {
            updateConfig(config)
          } catch (updateConfigError) {
            console.error(updateConfigError)
          }
        }, 0)
      }
    )
    const address = useField('address', config.address, isURL)
    const doReset = (): void => {
      if (resetBarrier) {
        return setBarrier(false)
      }
      Alert.alert('WARNING!!!', 'Do you really want to delete all data!\nThis can not be restored!', [
        {
          text: 'Yes! I want to delete everything!',
          onPress: deleteEverything
        },
        { text: 'No, abort!', onPress: () => setBarrier(false) }
      ])
    }

    return <View style={{ flex: 1 }}>
      <TopNavigation title='Consento' back={() => leave(() => navigation.navigate('vaults'))} />
      <BottomButtonView prototype={elementConfig} onPress={save}>
        <InputField
          proto={elementConfig.host}
          value={address.value}
          invalid={address.isInvalid}
          onEdit={address.handleValue}
        />
        <ConsentoButton proto={resetBarrier ? elementConfig.reset1 : elementConfig.reset2} onPress={doReset} />
      </BottomButtonView>
    </View>
  }
))
