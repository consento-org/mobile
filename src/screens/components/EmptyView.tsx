import React from 'react'
import { View, Text } from 'react-native'
import { Text as TextPlacement, ImagePlacement } from '../../styles/Component'
import { BottomButtonView, IBottomButtonProto } from './BottomButtonView'
import { exists } from '../../util/exists'

interface IEmptyViewProto extends IBottomButtonProto {
  backgroundColor: string
  description: TextPlacement
  illustration: ImagePlacement
  title: TextPlacement
}

interface IEmptyContentProps {
  prototype: IEmptyViewProto
}

export interface IEmptyViewProps extends IEmptyContentProps {
  onAdd?: () => any
  children?: React.ReactChild | React.ReactChild[]
  isEmpty?: boolean
}

const EmptyContent = ({ prototype: proto }: IEmptyContentProps): JSX.Element => {
  return <View style={{ padding: proto.description.place.x, display: 'flex', alignItems: 'center', alignSelf: 'center', width: '100%' }}>
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
}

export function EmptyView ({ prototype: proto, onAdd, children, isEmpty }: IEmptyViewProps): JSX.Element {
  return <BottomButtonView prototype={proto} onPress={onAdd}>
    {
      (isEmpty || !exists(children)) ? <EmptyContent prototype={proto} /> : children
    }
  </BottomButtonView>
}
