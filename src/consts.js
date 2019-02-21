import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export const BUTTON_SIZE = height > width ? width / 5 : height / 5
export const BUTTON_MARGIN = BUTTON_SIZE / 5
export const MAX_INPUT_LENGTH = 15
export const INPUT_HORIZONTAL_MARGIN = 30
export const DEFAULT_FONT_SIZE = 70

export const Colors = {
  ORANGE: 'orange',
  GREY: 'grey',
  DARK_GREY: '#474541',
  WHITE: '#fff'
}