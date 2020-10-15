import React, { useState, useContext } from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { observer } from 'mobx-react'
import _isURL from 'is-url-superb'
import { TopNavigation } from './components/TopNavigation'
import { InputField } from './components/InputField'
import { BottomButtonView } from './components/BottomButtonView'
import { useForm, FLOAT_CONVERT } from '../util/useForm'
import { ConsentoButton } from './components/ConsentoButton'
import { ConsentoContext, DEFAULT_ADDRESS, DEFAULT_EXPIRES } from '../model/Consento'
import { ScreenshotContext } from '../util/screenshots'
import { navigate } from '../util/navigate'
import { elementConfig } from '../styles/design/layer/elementConfig'
import { Credits } from './components/Credits'
import { assertExists } from '../util/assertExists'

const isURL = (value: string | null): string | true => {
  if (value === null) {
    return 'please enter url'
  }
  const isValid = _isURL(value)
  if (isValid) {
    return true
  }
  return 'not a valid url'
}

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

const { credits, expire, host, reset1, reset2 } = elementConfig.layers

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    alignItems: 'flex-start'
  },
  host: {
    width: '100%',
    marginTop: host.place.top
  },
  expire: {
    width: '100%',
    marginTop: expire.place.spaceY(host.place)
  },
  reset: {
    marginLeft: reset1.place.left,
    marginTop: reset1.place.spaceY(expire.place)
  },
  credits: {
    flexGrow: 1,
    width: 'auto',
    marginTop: credits.place.spaceY(reset1.place),
    marginLeft: credits.place.left,
    marginRight: credits.place.right
  }
})

export const Config = observer((): JSX.Element => {
  const [resetBarrier, setBarrier] = useState(true)
  const screenshots = useContext(ScreenshotContext)
  const consento = useContext(ConsentoContext)
  assertExists(consento)
  const { config, updateConfig, deleteEverything } = consento
  assertExists(config)
  const { leave, save, useField, useStringField } = useForm(newConfig => {
    setTimeout(() => {
      try {
        updateConfig(newConfig)
      } catch (updateConfigError) {
        console.error({ updateConfigError })
      }
    }, 0)
  })
  const address = useStringField('address', config.address, isURL)
  const expire = useField('expire', config.expire, FLOAT_CONVERT, isValidExpiration)
  const doReset = (): void => {
    if (resetBarrier) {
      return setBarrier(false)
    }
    Alert.alert('WARNING!!!', 'Do you really want to delete all data!\nThis can not be restored!', [
      {
        text: 'Yes! I want to delete everything!',
        onPress: () => {
          deleteEverything()
            .then(
              handleBack,
              error => console.error({ error })
            )
        }
      },
      { text: 'No, abort!', onPress: () => setBarrier(false) }
    ])
  }

  const handleBack = (): void => leave(() => navigate(['main', 'vaults']) /* TODO: navigate back to where you came from :) */)

  return <View style={styles.screen} onLayout={screenshots.config.handle(200)}>
    <TopNavigation title='Consento' back={handleBack} />
    <BottomButtonView src={elementConfig} onPress={save} containerStyle={styles.container}>
      <InputField
        src={elementConfig.layers.host}
        style={styles.host}
        value={address.value ?? null}
        defaultValue={DEFAULT_ADDRESS}
        invalid={address.isInvalid}
        onEdit={address.handleValue}
      />
      <InputField
        src={elementConfig.layers.expire}
        style={styles.expire}
        value={expire.valueString ?? null}
        defaultValue={DEFAULT_EXPIRES.toString()}
        invalid={expire.isInvalid}
        onEdit={string => expire.handleString(string ?? undefined)}
      />
      <ConsentoButton src={resetBarrier ? reset1 : reset2} style={styles.reset} onPress={doReset} />
      <Credits style={styles.credits} />
    </BottomButtonView>
  </View>
})
