import React from 'react'
import { View, Text } from 'react-native'
import { Text as TextPlacement, ImagePlacement } from '../../styles/Component'
import { BottomButtonView, IBottomButtonProto } from './BottomButtonView'

interface IEmptyViewProto extends IBottomButtonProto {
  backgroundColor: string
  description: TextPlacement
  illustration: ImagePlacement
  title: TextPlacement
}

export function EmptyView ({ prototype: proto, onAdd }: { prototype: IEmptyViewProto, onAdd?: () => any }): JSX.Element {
  return <BottomButtonView prototype={proto} onPress={onAdd}>
    <View style={{ padding: proto.description.place.x, display: 'flex', alignItems: 'center', alignSelf: 'center', width: '100%' }}>
      {
        proto.illustration.img({
          marginBottom: proto.title.place.top - proto.illustration.place.bottom
        })
      }
      <Text style={{
        ...proto.title.style,
        marginBottom: proto.description.place.top - proto.title.place.bottom
      }}>{proto.title.text}</Text>
      <Text style={proto.description.style}>{proto.description.text}</Text>
    </View>
  </BottomButtonView>
}
