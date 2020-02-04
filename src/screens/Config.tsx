import React, { useState, useContext } from 'react'
import { View, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { InputField } from './components/InputField'
import { elementConfig } from '../styles/component/elementConfig'
import { BottomButtonView } from './components/BottomButtonView'
import { TNavigation, withNavigation } from './navigation'
import { useForm, FLOAT_CONVERT } from '../util/useForm'
import isURL from 'is-url-superb'
import { ConsentoButton } from './components/ConsentoButton'
import { ConsentoContext } from '../model/Consento'
import { observer } from 'mobx-react'
import { ScreenshotContext } from '../util/screenshots'

function isValidExpiration (input: string): boolean | string {
  if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(input)) {
    return 'You need to enter a number'
  }
  const num = parseFloat(input)
  if (num < 10) {
    return 'Please use at least 10 seconds'
  }
  return true
}

export const Config = withNavigation(observer(
  ({ navigation }: { navigation: TNavigation }): JSX.Element => {
    const [resetBarrier, setBarrier] = useState(true)
    const screenshots = useContext(ScreenshotContext)
    const { config, updateConfig, deleteEverything } = useContext(ConsentoContext)
    const { leave, save, useField, useStringField } = useForm(navigation,
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
    const address = useStringField('address', config.address, isURL)
    const expire = useField('expire', config.expire, FLOAT_CONVERT, isValidExpiration)
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

    return <View style={{ flex: 1 }} onLayout={screenshots.config.handle(200)}>
      <TopNavigation title='Consento' back={() => leave(() => navigation.navigate('vaults'))} />
      <BottomButtonView prototype={elementConfig} onPress={save}>
        <InputField
          proto={elementConfig.host}
          value={address.value}
          invalid={address.isInvalid}
          onEdit={address.handleValue}
        />
        <InputField
          proto={elementConfig.expire}
          value={expire.valueString}
          invalid={expire.isInvalid}
          onEdit={expire.handleString}
        />
        <ConsentoButton proto={resetBarrier ? elementConfig.reset1 : elementConfig.reset2} onPress={doReset} />
        <View style={{ display: 'flex', alignItems: 'center', position: 'absolute', top: elementConfig.iconNgiLedger.place.top, width: '100%' }}>
          <View style={{ width: elementConfig.funding.place.width }}>
            <View style={{ display: 'flex', alignContent: 'space-between', flexDirection: 'row' }}>
              {elementConfig.iconNgiLedger.img({})}
              <View style={{ flexGrow: 1 }} />
              {elementConfig.iconEu.img({})}
            </View>
            {elementConfig.funding.render({ style: { marginTop: elementConfig.funding.place.top - Math.max(elementConfig.iconNgiLedger.place.bottom, elementConfig.iconEu.place.bottom) } })}
          </View>
        </View>
      </BottomButtonView>
    </View>
  }
))
