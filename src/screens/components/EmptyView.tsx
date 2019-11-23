import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { Text as TextPlacement, ImagePlacement, Link, Polygon, Component } from '../../styles/Component'
import { ConsentoButton } from './ConsentoButton'

interface IBottomArea {
  shape: Polygon
}

interface IAddButton extends Component {
  shape: Polygon
  label: TextPlacement
}

interface IEmptyViewProto {
  backgroundColor: string
  description: TextPlacement
  illustration: ImagePlacement
  title: TextPlacement
  bottomArea?: Link<IBottomArea>
  addButton?: Link<IAddButton>
}

export function EmptyView ({ prototype: proto, onAdd }: { prototype: IEmptyViewProto, onAdd?: () => void }) {
  return <View style={{ flexGrow: 1, display: 'flex' }}><ScrollView centerContent={ true } style={{ backgroundColor: proto.backgroundColor }} contentContainerStyle={{ flexDirection: 'row', display: 'flex', flexGrow: 1 }}>
      <View style={{ padding: proto.description.place.x, display: 'flex', alignItems: 'center', alignSelf: 'center', width: '100%' }}>
        {
          proto.illustration.img({
            marginBottom: proto.title.place.top - proto.illustration.place.bottom
          })
        }
        <Text style={{
          ...proto.title.style,
          marginBottom: proto.description.place.top - proto.title.place.bottom
        }}>{ proto.title.text }</Text>
        <Text style={ proto.description.style }>{ proto.description.text }</Text>
        { proto.bottomArea !== undefined ? <View style={{ height: proto.bottomArea.place.height, width: '100%' }} /> : null }
      </View>
    </ScrollView>
    { proto.addButton !== undefined
      ? <View style={{ position: 'absolute', bottom: 0, width: '100%', height: proto.bottomArea.place.height, display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          { proto.bottomArea !== undefined ? <proto.bottomArea.component.shape.RenderRect style={{ width: '100%', height: '100%', position: 'absolute' }}/> : null }
          <ConsentoButton title={ proto.addButton.text.label } style={{ width: 200, height: 36 }} light={ true } onPress={ onAdd } />
        </View>
      : null
    }
  </View>
}
