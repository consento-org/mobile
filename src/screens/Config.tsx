import React, { useState } from 'react'
import { View } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { InputField } from './components/InputField'
import { elementConfig } from '../styles/component/elementConfig'
import { BottomButtonView } from './components/BottomButtonView'
import { useConfig } from '../util/useConfig'
import { TNavigation, withNavigation } from './navigation'
import { useForm } from '../util/useForm'
import isURL from 'is-url-superb'

export const Config = withNavigation(
  ({ navigation }: { navigation: TNavigation }): JSX.Element => {
    const [config, setConfig] = useConfig()
    const [address, setAddress] = useState(config.address)
    const { setDirty, isInvalid, leave, save } = useForm(navigation, () => {
      setConfig({
        ...config,
        address
      })
    })
    return <View style={{ ...styles.screen, display: 'flex' }}>
      <TopNavigation title='Consento' back={() => leave(() => navigation.navigate('vaults'))} />
      <BottomButtonView prototype={elementConfig} onPress={save}>
        <InputField
          proto={elementConfig.host}
          value={address}
          invalid={isInvalid}
          onEdit={newAddress => {
            setAddress(newAddress)
            setDirty(newAddress !== config.address, !isURL(newAddress))
          }} />
      </BottomButtonView>
    </View>
  }
)
