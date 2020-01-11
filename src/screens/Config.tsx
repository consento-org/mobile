import React, { useState, useContext, useEffect } from 'react'
import { View, Alert, BackHandler } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { InputField } from './components/InputField'
import { elementConfig } from '../styles/component/elementConfig'
import { BottomButtonView } from './components/BottomButtonView'
import { useConfig } from '../util/useConfig'
import { TNavigation, withNavigation } from './navigation'
import { useForm } from '../util/useForm'
import isURL from 'is-url-superb'
import { ConsentoButton } from './components/ConsentoButton'
import { ConsentoContext } from '../model/ConsentoContext'
import { rimraf } from '../util/expoRimraf'
import { createDefaultUser } from '../model/User'
import { Loading } from './Loading'

export const Config = withNavigation(
  ({ navigation }: { navigation: TNavigation }): JSX.Element => {
    const [config, setConfig] = useConfig()
    const [resetBarrier, setBarrier] = useState(true)
    const [address, setAddress] = useState(config.address)
    const { users } = useContext(ConsentoContext)
    const [isDeleting, setDeleting] = useState(false)
    const { setDirty, isInvalid, leave, save } = useForm(navigation, () => {
      setConfig({
        ...config,
        address
      })
    })
    useEffect(() => {
      if (isDeleting) return
      const lockBackHandler = (): boolean => true
      BackHandler.addEventListener('hardwareBackPress', lockBackHandler)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', lockBackHandler)
      }
    }, [isDeleting])

    if (isDeleting) {
      return <Loading />
    }

    const doReset = (): void => {
      if (resetBarrier) {
        return setBarrier(false)
      }
      Alert.alert('WARNING!!!', 'Do you really want to delete all data!\nThis can not be restored!', [
        {
          text: 'Yes! I want to delete everything!',
          onPress: () => {
            setDeleting(true)
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            rimraf('', (state) => console.log(state)).finally(() => {
              const user = users.items[0]
              users.add(createDefaultUser())
              users.delete(user)
            })
          }
        },
        { text: 'No, abort!', onPress: () => setBarrier(false) }
      ])
    }

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
        <ConsentoButton proto={resetBarrier ? elementConfig.reset1 : elementConfig.reset2} onPress={doReset} />
      </BottomButtonView>
    </View>
  }
)
