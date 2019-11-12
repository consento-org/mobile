import React from 'react'
import { View, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import { Slice9Placement, Text as TextPlacement, Component } from './styles/Component'

interface ISlice9Component extends Component {
  bg: Slice9Placement
  label: TextPlacement
}

interface ISlice9ButtonProps {
  prototype: ISlice9Component,
  style: ViewStyle,
  label: string
}

export class Slice9Button extends React.Component<ISlice9ButtonProps, { width: number, height: number }> {
  _textStyle: TextStyle
  _text: React.RefObject<Text>

  constructor (props: ISlice9ButtonProps, context?: any) {
    super(props, context)
    const proto = this.props.prototype
    this._textStyle = {
      ...proto.label.style,
      width: 'auto',
      position: 'absolute',
      top: proto.label.place.top,
      height: proto.label.place.height
    }
    this._text = React.createRef()
  }

  measure () {
    this._text.current.measure((_, __, width, height) => {
      this.setState({ width: (width + 0.5) | 0, height: (height + 0.5) | 0 })
    })
  }

  render () {
    const proto = this.props.prototype

    const style: ViewStyle = {
      position: 'relative',
      ...this.props.style
    }

    let width: number
    let height: number

    if (typeof this.props.style.width === 'string') {
      console.warn('Slice9 buttons dont support dynamic pixel widths')
    } else {
      width = this.props.style.width
    }
    if (typeof this.props.style.height === 'string') {
      console.warn('Slice9 buttons dont support dynamic pixel heights ')
    } else {
      height = this.props.style.height
    }

    if (width === undefined && this.state && this.state.width) {
      width = proto.label.place.left + this.state.width + proto.width - proto.label.place.right
    }
    if (height === undefined && this.state && this.state.height) {
      height = proto.label.place.top + this.state.height + proto.height - proto.label.place.bottom
    }

    style.width = width | 0
    style.height = height | 0

    const w = (width - proto.bg.place.left + proto.bg.place.right - proto.width)
    const h = (height - proto.bg.place.top + proto.bg.place.bottom - proto.height)

    return <TouchableOpacity style={ style }>
      { width !== undefined && height !== undefined ? proto.bg.render({
        top: proto.bg.place.top,
        left: proto.bg.place.left,
        width: w,
        height: h,
        position: 'absolute'
      }) : null }
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Text ref={ this._text } style={{ ...this._textStyle }} onLayout={ () => this.measure() }>{ this.props.label }</Text>
      </View>
    </TouchableOpacity>
  }
}
