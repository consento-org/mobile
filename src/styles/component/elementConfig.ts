// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Link, Text, ImagePlacement } from '../Component'
import { elementBottomButton } from './elementBottomButton'
import { elementFormInputField } from './elementFormInputField'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { buttonContainerEnabled } from './buttonContainerEnabled'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementConfigClass extends Component {
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'Save Changes'
  })
  host = new Link(elementFormInputField, { x: 0, y: 18, w: 375, h: 85 }, {
    active: 'https://192.168.11.11',
    label: 'host',
    caption: 'during beta we need to connect to a server.'
  })
  expire = new Link(elementFormInputField, { x: 0, y: 119, w: 375, h: 85 }, {
    active: '300',
    label: 'expire',
    caption: 'seconds it takes for a consento to expire.'
  })
  reset1 = new Link(buttonContainerDisabled, { x: 23, y: 234, w: 180, h: 36 }, {
    label: 'reset'
  })
  reset2 = new Link(buttonContainerEnabled, { x: 23, y: 234, w: 180, h: 36 }, {
    label: 'RESET'
  })
  funding: Text
  iconEu: ImagePlacement
  iconNgiLedger: ImagePlacement
  constructor () {
    super('elementConfig', 375, 970, Color.white)
    this.funding = new Text('This project has received funding from the European Union’s Horizon 2020 research and innovation programme within the framework of the LEDGER Project funded under grant agreement No825268.', TextStyles.SubtitleRobotoRegular13GreyCenter, { x: 21, y: 389, w: 322, h: 66 }, this)
    this.iconEu = new ImagePlacement(Asset.iconEu, { x: 277, y: 327, w: 66, h: 44 }, this)
    this.iconNgiLedger = new ImagePlacement(Asset.iconNgiLedger, { x: 21, y: 323, w: 189, h: 53 }, this)
  }
}

export const elementConfig = new ElementConfigClass()
