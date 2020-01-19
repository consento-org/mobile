import React from 'react'
import { View, ScrollView } from 'react-native'
import { ConsentoButton } from './ConsentoButton'
import { Link } from '../../styles/Component'
import { ElementBottomButtonClass } from '../../styles/component/elementBottomButton'
import { exists } from '../../util/exists'

export interface IBottomButtonProto {
  backgroundColor: string
  bottomButton?: Link<ElementBottomButtonClass, {
    buttonLabel: string
  }>
}

export function BottomButtonView ({ prototype: proto, children, onPress }: { prototype: IBottomButtonProto, children?: React.ReactChild | React.ReactChild[], onPress?: () => any}): JSX.Element {
  const { bottomButton, backgroundColor } = proto
  const hasBottomButton = exists(bottomButton)
  return <View style={{ flexGrow: 1, display: 'flex', position: 'relative', alignSelf: 'stretch' }}>
    <ScrollView
      centerContent
      style={{ backgroundColor }}
      contentContainerStyle={{ display: 'flex', flexGrow: 1 }}>
      <View style={{ paddingBottom: hasBottomButton ? bottomButton.place.height : 0 }}>
        {children}
      </View>
    </ScrollView>
    {hasBottomButton
      ? <View style={{ position: 'absolute', bottom: 0, width: '100%', height: bottomButton.place.height, display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <bottomButton.component.bottomArea.component.shape.RenderRect style={{ width: '100%', height: '100%', position: 'absolute' }} />
        <ConsentoButton title={bottomButton.text.buttonLabel} style={{ width: 200, height: 36 }} light onPress={onPress} />
      </View>
      : null}
  </View>
}
