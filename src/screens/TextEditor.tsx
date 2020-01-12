import React, { useState } from 'react'
import { View, ViewStyle, TouchableOpacity, Text, TextInput } from 'react-native'
import { topPadding } from '../styles'
import { elementTextEditor } from '../styles/component/elementTextEditor'
import { useVUnits } from '../util/useVUnits'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeArea } from 'react-native-safe-area-context'

const saveSize: ViewStyle = {
  position: 'absolute',
  ...elementTextEditor.saveSize.place.style()
}

const editSize: ViewStyle = {
  position: 'absolute',
  ...elementTextEditor.editSize.place.style()
}

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet dictum sit amet justo donec. Urna porttitor rhoncus dolor purus. Diam sollicitudin tempor id eu nisl. Iaculis urna id volutpat lacus. Faucibus in ornare quam viverra orci sagittis eu. Risus quis varius quam quisque id diam vel quam. Viverra tellus in hac habitasse platea dictumst. Proin fermentum leo vel orci porta non pulvinar. Egestas maecenas pharetra convallis posuere morbi. Nunc lobortis mattis aliquam faucibus purus in. Amet mauris commodo quis imperdiet massa tincidunt. Fringilla urna porttitor rhoncus dolor purus non. Commodo elit at imperdiet dui accumsan sit amet. Elementum integer enim neque volutpat ac tincidunt vitae semper. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Tellus integer feugiat scelerisque varius morbi enim nunc. In hac habitasse platea dictumst quisque sagittis purus sit. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Enim lobortis scelerisque fermentum dui faucibus in ornare quam.

Tortor condimentum lacinia quis vel eros donec. Urna duis convallis convallis tellus id. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. Elementum integer enim neque volutpat ac tincidunt vitae semper. Metus vulputate eu scelerisque felis imperdiet proin fermentum. Tempor orci eu lobortis elementum nibh tellus molestie nunc non. Nec feugiat in fermentum posuere urna nec tincidunt praesent. Dui ut ornare lectus sit amet est. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc. Dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu. Arcu dictum varius duis at consectetur lorem donec. Odio tempor orci dapibus ultrices in iaculis nunc sed. Cursus in hac habitasse platea dictumst quisque sagittis purus. Vitae et leo duis ut diam quam nulla porttitor. Donec enim diam vulputate ut pharetra sit amet.

Praesent semper feugiat nibh sed pulvinar proin gravida. Volutpat consequat mauris nunc congue nisi vitae. Elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl. Arcu dictum varius duis at consectetur. Amet risus nullam eget felis eget nunc lobortis mattis. Non odio euismod lacinia at quis risus. Eu volutpat odio facilisis mauris sit amet. Gravida quis blandit turpis cursus in hac. Elit at imperdiet dui accumsan. Vitae et leo duis ut diam quam nulla. Vitae sapien pellentesque habitant morbi tristique. Pellentesque adipiscing commodo elit at imperdiet. Tellus molestie nunc non blandit massa enim nec dui nunc. Augue ut lectus arcu bibendum.

Vehicula ipsum a arcu cursus vitae congue mauris. Quis ipsum suspendisse ultrices gravida dictum fusce. Ullamcorper eget nulla facilisi etiam dignissim. Lectus sit amet est placerat. Enim facilisis gravida neque convallis a cras semper auctor. Aliquam ultrices sagittis orci a. Pellentesque dignissim enim sit amet venenatis. Nisi lacus sed viverra tellus in hac. Mattis aliquam faucibus purus in massa tempor. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero id. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Felis eget velit aliquet sagittis id consectetur purus. Quam lacus suspendisse faucibus interdum posuere. Ultricies mi quis hendrerit dolor.

Lacus suspendisse faucibus interdum posuere lorem ipsum dolor. Amet est placerat in egestas erat. Sed enim ut sem viverra aliquet. Augue lacus viverra vitae congue eu consequat ac. Nisi quis eleifend quam adipiscing vitae proin. Vivamus arcu felis bibendum ut tristique et egestas quis ipsum. Venenatis cras sed felis eget velit aliquet sagittis id. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Sed vulputate odio ut enim. Vel pretium lectus quam id leo. Vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor. Nulla aliquet enim tortor at auctor urna nunc id cursus. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci.

Dui sapien eget mi proin sed libero enim. Tellus elementum sagittis vitae et leo. Bibendum ut tristique et egestas quis. Augue ut lectus arcu bibendum. Tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Vestibulum lectus mauris ultrices eros in. Metus dictum at tempor commodo ullamcorper a lacus vestibulum. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Mattis rhoncus urna neque viverra justo nec ultrices. Vulputate dignissim suspendisse in est ante in nibh mauris cursus. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Nulla aliquet enim tortor at auctor urna nunc id. Luctus accumsan tortor posuere ac ut. Rhoncus urna neque viverra justo nec ultrices dui sapien eget.

Enim blandit volutpat maecenas volutpat blandit aliquam etiam. Phasellus egestas tellus rutrum tellus pellentesque. Tincidunt id aliquet risus feugiat in ante metus. Vitae tortor condimentum lacinia quis vel. Faucibus in ornare quam viverra. Mauris a diam maecenas sed enim ut sem viverra aliquet. Lorem mollis aliquam ut porttitor leo a. Nec sagittis aliquam malesuada bibendum arcu. Et molestie ac feugiat sed lectus vestibulum. Ornare suspendisse sed nisi lacus sed viverra tellus. Elit ut aliquam purus sit amet luctus venenatis. Tempor commodo ullamcorper a lacus. Vitae congue mauris rhoncus aenean vel. Nisi porta lorem mollis aliquam. Amet cursus sit amet dictum sit amet.

Est velit egestas dui id ornare arcu odio ut. Tincidunt arcu non sodales neque sodales ut etiam. Semper quis lectus nulla at volutpat diam. Non nisi est sit amet facilisis. Sodales neque sodales ut etiam sit amet. Bibendum est ultricies integer quis auctor elit sed vulputate. Enim neque volutpat ac tincidunt vitae semper. Cursus in hac habitasse platea dictumst quisque. Urna nunc id cursus metus aliquam eleifend mi in nulla. Porta lorem mollis aliquam ut porttitor leo a diam. Tellus orci ac auctor augue mauris augue neque gravida. Dapibus ultrices in iaculis nunc sed augue. Massa sapien faucibus et molestie ac feugiat sed lectus vestibulum. Tempor id eu nisl nunc mi ipsum. Justo laoreet sit amet cursus sit amet dictum sit amet. Dui id ornare arcu odio. Pretium nibh ipsum consequat nisl vel pretium. Elementum pulvinar etiam non quam. Odio euismod lacinia at quis. Pellentesque id nibh tortor id aliquet lectus proin nibh.

Orci phasellus egestas tellus rutrum tellus pellentesque eu. Sagittis id consectetur purus ut faucibus pulvinar elementum. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Ac turpis egestas integer eget. Cursus turpis massa tincidunt dui ut. Integer enim neque volutpat ac tincidunt vitae. Vitae justo eget magna fermentum iaculis eu non. Libero volutpat sed cras ornare arcu dui vivamus arcu. Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Urna condimentum mattis pellentesque id nibh tortor id. Eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Scelerisque in dictum non consectetur a erat nam. Porttitor leo a diam sollicitudin tempor. Viverra aliquet eget sit amet tellus cras adipiscing. Varius duis at consectetur lorem donec massa sapien. Laoreet sit amet cursus sit. Dui id ornare arcu odio ut sem nulla pharetra. Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla.

Nec ultrices dui sapien eget mi proin sed libero. Justo donec enim diam vulputate ut pharetra sit. Eleifend donec pretium vulputate sapien nec sagittis. Pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper. Quisque non tellus orci ac auctor augue mauris augue. Nisi vitae suscipit tellus mauris a diam maecenas. Quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor. Cras adipiscing enim eu turpis egestas pretium aenean. Luctus accumsan tortor posuere ac ut consequat semper viverra. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Lacinia at quis risus sed vulputate odio ut enim. Ac tortor vitae purus faucibus ornare suspendisse sed. Ultrices in iaculis nunc sed augue lacus viverra. Ac odio tempor orci dapibus ultrices in iaculis nunc. Amet est placerat in egestas erat imperdiet sed euismod nisi. Rhoncus mattis rhoncus urna neque. Nisi vitae suscipit tellus mauris a. Malesuada proin libero nunc consequat interdum varius sit amet. Vel facilisis volutpat est velit egestas dui.

Blandit turpis cursus in hac habitasse. Turpis cursus in hac habitasse platea dictumst quisque sagittis. Pretium quam vulputate dignissim suspendisse in est ante in nibh. Tempus egestas sed sed risus pretium quam. Et malesuada fames ac turpis egestas. Gravida neque convallis a cras. Orci sagittis eu volutpat odio facilisis mauris sit. Arcu bibendum at varius vel pharetra vel turpis nunc. Gravida neque convallis a cras. Rhoncus est pellentesque elit ullamcorper dignissim cras. Bibendum neque egestas congue quisque egestas diam. Eget aliquet nibh praesent tristique magna. Non enim praesent elementum facilisis leo. Massa massa ultricies mi quis hendrerit dolor. Est velit egestas dui id ornare arcu odio. Lectus magna fringilla urna porttitor rhoncus dolor. Viverra vitae congue eu consequat ac felis donec. Tellus in metus vulputate eu. Amet luctus venenatis lectus magna fringilla urna porttitor.

Amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Nibh ipsum consequat nisl vel pretium lectus quam id. Sed blandit libero volutpat sed cras ornare. Eu lobortis elementum nibh tellus molestie nunc. Aliquam purus sit amet luctus venenatis lectus magna fringilla. Risus pretium quam vulputate dignissim suspendisse. Molestie at elementum eu facilisis sed odio morbi quis. Quam quisque id diam vel. Commodo odio aenean sed adipiscing diam. Faucibus pulvinar elementum integer enim. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Mauris pharetra et ultrices neque ornare aenean. Accumsan tortor posuere ac ut consequat semper viverra. Bibendum arcu vitae elementum curabitur vitae nunc sed. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero id. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Id eu nisl nunc mi ipsum faucibus vitae. Cursus vitae congue mauris rhoncus. Parturient montes nascetur ridiculus mus. Integer malesuada nunc vel risus commodo viverra.

Velit egestas dui id ornare arcu odio ut. Nisl purus in mollis nunc sed id semper. Massa id neque aliquam vestibulum morbi blandit. Id eu nisl nunc mi ipsum faucibus. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Semper eget duis at tellus at urna condimentum mattis pellentesque. Neque gravida in fermentum et sollicitudin ac orci phasellus egestas. Vel risus commodo viverra maecenas accumsan. Enim nulla aliquet porttitor lacus. Ac ut consequat semper viverra nam. Euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis. Viverra nam libero justo laoreet. Cursus sit amet dictum sit amet justo donec enim. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Sit amet consectetur adipiscing elit duis tristique.

Pellentesque adipiscing commodo elit at imperdiet dui. Fusce id velit ut tortor pretium viverra suspendisse. Condimentum vitae sapien pellentesque habitant morbi tristique senectus et netus. Ornare lectus sit amet est. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Diam maecenas sed enim ut sem viverra aliquet eget sit. At consectetur lorem donec massa sapien faucibus et molestie ac. Mattis pellentesque id nibh tortor id aliquet lectus proin nibh. Ullamcorper eget nulla facilisi etiam dignissim diam. Et tortor consequat id porta nibh venenatis cras. Amet porttitor eget dolor morbi non arcu. Sit amet luctus venenatis lectus magna. Eu scelerisque felis imperdiet proin fermentum leo vel orci porta. Vestibulum sed arcu non odio. Cursus sit amet dictum sit amet justo donec enim. Quam viverra orci sagittis eu volutpat odio facilisis mauris. Urna nec tincidunt praesent semper. Mauris rhoncus aenean vel elit scelerisque mauris. Enim lobortis scelerisque fermentum dui faucibus in ornare quam.

Eget est lorem ipsum dolor. Tellus id interdum velit laoreet. Amet dictum sit amet justo donec enim. In cursus turpis massa tincidunt dui. Cursus in hac habitasse platea dictumst quisque sagittis purus sit. Eget aliquet nibh praesent tristique magna sit. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Curabitur gravida arcu ac tortor dignissim convallis aenean. Nibh sit amet commodo nulla. Vel pretium lectus quam id leo in vitae turpis. Semper feugiat nibh sed pulvinar. Pharetra massa massa ultricies mi quis hendrerit dolor. Suspendisse in est ante in nibh mauris cursus mattis. Dolor morbi non arcu risus. Dignissim sodales ut eu sem integer. Dignissim cras tincidunt lobortis feugiat vivamus at augue. Nunc lobortis mattis aliquam faucibus purus in.

Felis eget nunc lobortis mattis. Nam aliquam sem et tortor consequat id porta nibh. Dictum varius duis at consectetur lorem donec massa. Amet est placerat in egestas erat imperdiet. Adipiscing elit pellentesque habitant morbi tristique senectus et netus. Aliquam faucibus purus in massa tempor. Nibh tellus molestie nunc non blandit massa enim nec dui. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Egestas integer eget aliquet nibh praesent tristique. Mauris cursus mattis molestie a iaculis at erat pellentesque adipiscing. Faucibus et molestie ac feugiat sed. Varius quam quisque id diam vel. Amet purus gravida quis blandit turpis cursus in. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Interdum velit laoreet id donec. Nullam non nisi est sit amet facilisis magna etiam.

Consectetur a erat nam at lectus. Euismod quis viverra nibh cras pulvinar mattis nunc sed. Arcu bibendum at varius vel pharetra vel. At auctor urna nunc id cursus metus aliquam eleifend. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae proin. Accumsan lacus vel facilisis volutpat est velit egestas dui id. Integer feugiat scelerisque varius morbi. Tempus iaculis urna id volutpat lacus laoreet non curabitur. Facilisis leo vel fringilla est ullamcorper eget nulla. Odio facilisis mauris sit amet massa. Lectus sit amet est placerat. Eu mi bibendum neque egestas congue quisque egestas.
`

export const TextEditor = (): JSX.Element => {
  const { vh, vw } = useVUnits()
  const insets = useSafeArea()

  const [editing, setEditing] = useState<boolean>(false)

  const mainEditStyle: ViewStyle = {
    position: 'absolute',
    top: elementTextEditor.readable.place.top,
    height: vh(100) - topPadding - elementTextEditor.readable.place.top - insets.bottom,
    width: '100%',
    paddingLeft: elementTextEditor.readable.place.left,
    paddingRight: elementTextEditor.width - elementTextEditor.readable.place.right
  }

  return <View style={{ position: 'absolute', top: topPadding, height: vh(100) - topPadding, width: '100%' }}>
    <TouchableOpacity style={saveSize}>
      <elementTextEditor.save.Render />
    </TouchableOpacity>
    <TouchableOpacity style={{ ...editSize, left: vw(100) - (elementTextEditor.width - elementTextEditor.edit.place.left) }} onPress={() => setEditing(!editing)}>
      <Text style={{ ...elementTextEditor.edit.style, top: elementTextEditor.edit.place.top }}>{elementTextEditor.edit.text}</Text>
    </TouchableOpacity>
    <elementTextEditor.title.Render onEdit={editing ? () => null : null} targetRef={(textInput) => textInput?.focus()} selectable />
    <elementTextEditor.size.Render />
    {
      editing
        ? <TextInput
          style={{
            ...mainEditStyle,
            ...elementTextEditor.readable.style
          }}
          multiline
          defaultValue={text}
          selection={{ start: 0 }}
          editable
        />
        : <ScrollView
          style={{
            ...mainEditStyle,
            paddingBottom: 35
          }}
        ><Text style={elementTextEditor.readable.style} selectable>{text}</Text></ScrollView>
    }
  </View>
}
