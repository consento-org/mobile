import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { Text as TextPlacement, ImagePlacement } from '../../styles/Component'

interface IEmptyViewProto {
  backgroundColor: string
  description: TextPlacement
  illustration: ImagePlacement
  title: TextPlacement
}

export class EmptyView extends React.Component<{prototype: IEmptyViewProto}> {
  render () {
    const proto = this.props.prototype
    return <ScrollView centerContent={ true } style={{ backgroundColor: proto.backgroundColor }} contentContainerStyle={{ flexDirection: 'row', display: 'flex', flexGrow: 1 }}>
      <View style={{ padding: proto.description.place.x, display: 'flex', alignItems: 'center', alignSelf: 'center',  }}>
        {
          proto.illustration.img({ 
            marginBottom: proto.title.place.top - proto.illustration.place.bottom
          })
        }
        <Text style={{
          ...proto.title.style,
          marginBottom: proto.description.place.top - proto.title.place.bottom
        }}>{ proto.title.text }</Text>
        <Text style={{
          ...proto.description.style,
          overflow: 'scroll',
        }}>{ proto.description.text }</Text>
      </View>
    </ScrollView>
  }
}
