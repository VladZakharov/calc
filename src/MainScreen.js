import React from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

const { width, height } = Dimensions.get('window')

const BUTTON_SIZE = height > width ? width / 5 : height / 5

const BUTTON_MARGIN = BUTTON_SIZE / 5

const MAX_INPUT_LENGTH = 15

const INPUT_HORIZONTAL_MARGIN = 30

const DEFAULT_FONT_SIZE = 70

const Operations = {
  ADD: 1,
  SUB: 2,
  MULT: 3,
  DIV: 4
}

const ShowValue = {
  INPUT: 1,
  MEMORIZED: 2,
  RESULT: 3
}

const initialState = {
  result: '',
  input: '0',
  memorized: '',
  showValue: ShowValue.INPUT,
  operation: null,
  inputFontSize: DEFAULT_FONT_SIZE
}

export default class MainScreen extends React.Component {
  state = initialState

  resetState = () => { this.setState(initialState) }

  onChangeSignPress = () => {
    const name = this.getShowValueName()
    const value = this.state[name]
    this.setState({ [name]: value.startsWith('-') ? value.slice(1) : `-${value}` })
  }

  onPercentPress = () => {
    const name = this.getShowValueName()
    const value = this.state[name]
    this.setState({ [name]: (parseFloat(value) * 0.01).toString() })
  }

  onCommaPress = () => {
    let { input } = this.state
    input = input || '0'
    this.setState({
      input: input.includes('.') ? input : `${input}.`,
      showValue: ShowValue.INPUT
    })
  }

  onDigitPress = (digit) => () => {
    const { input } = this.state
    const name = this.getShowValueName()
    const value = this.state[name]
    if (digit === '0' && value === '0') { return }
    if (input.length >= MAX_INPUT_LENGTH) { return }
    let newValue
    switch (input) {
      case '0':
        newValue = digit
        break
      case '-0':
        newValue = `-${digit}`
        break
      default:
        newValue = `${input}${digit}`
        break
    }
    this.setState({ input: newValue, showValue: ShowValue.INPUT })
  }

  onOperationPress = (operation) => async () => {
    if (this.state.operation) {
      await this.onResultPress()
    }
    const name = this.getShowValueName()
    const value = this.state[name]

    this.setState({
      operation,
      memorized: value,
      result: '',
      input: '',
      showValue: ShowValue.MEMORIZED
    })
  }

  onResultPress = async () => {
    let result
    if (!this.state.memorized || !this.state.input) {
      this.setState({ operation: null })
      return
    }
    const val1 = parseFloat(this.state.memorized)
    const val2 = parseFloat(this.state.input)
    const { operation } = this.state
    switch (operation) {
      case Operations.ADD:
        result = val1 + val2
        break
      case Operations.SUB:
        result = val1 - val2
        break
      case Operations.MULT:
        result = val1 * val2
        break
      case Operations.DIV:
        result = val1 / val2
        break
    }
    return new Promise((resolve) => {
      this.setState({
        result: result.toString(),
        input: '',
        memorized: '',
        showValue: ShowValue.RESULT,
        operation: null
      }, resolve)
    })
  }

  getShowValueName = () => {
    switch (this.state.showValue) {
      case ShowValue.INPUT:
        return 'input'
      case ShowValue.MEMORIZED:
        return 'memorized'
      case ShowValue.RESULT:
        return 'result'
    }
  }

  beautifyValue = (value) => {
    const valueParts = value.split('.')
    const intPart = valueParts[0]
    let result = ''
    for (let i = intPart.length - 1; i >= 0; i--) {
      result = intPart[i] + result
      if ((intPart.length - i) % 3 === 0) {
        result = ' ' + result
      }
    }
    if (valueParts.length > 1) {
      result = `${result}.${valueParts[1]}`
    }
    return result
  }

  showValue = () => {
    const name = this.getShowValueName()
    const value = this.state[name]
    return this.beautifyValue(value).replace('.', ',')
  }

  getOperationLayoutData = (operation) => {
    let text
    switch (operation) {
      case Operations.ADD:
        text = '+'
        break
      case Operations.SUB:
        text = '-'
        break
      case Operations.MULT:
        text = '×'
        break
      case Operations.DIV:
        text = '÷'
        break
    }
    const isActive = this.state.operation === operation
    return {
      text,
      color: isActive ? '#fff' : 'orange',
      textColor: isActive ? 'orange' : '#fff',
      func: this.onOperationPress(operation)
    }
  }

  getLayout = () => [
    [
      { text: 'C', color: 'grey', textColor: '#474541', func: this.resetState },
      { text: '±', color: 'grey', textColor: '#474541', func: this.onChangeSignPress },
      { text: '%', color: 'grey', textColor: '#474541', func: this.onPercentPress },
      this.getOperationLayoutData(Operations.DIV),
    ],
    [
      { text: '7', color: '#474541', textColor: '#fff', func: this.onDigitPress('7') },
      { text: '8', color: '#474541', textColor: '#fff', func: this.onDigitPress('8') },
      { text: '9', color: '#474541', textColor: '#fff', func: this.onDigitPress('9') },
      this.getOperationLayoutData(Operations.MULT),
    ],
    [
      { text: '4', color: '#474541', textColor: '#fff', func: this.onDigitPress('4') },
      { text: '5', color: '#474541', textColor: '#fff', func: this.onDigitPress('5') },
      { text: '6', color: '#474541', textColor: '#fff', func: this.onDigitPress('6') },
      this.getOperationLayoutData(Operations.SUB),
    ],
    [
      { text: '1', color: '#474541', textColor: '#fff', func: this.onDigitPress('1') },
      { text: '2', color: '#474541', textColor: '#fff', func: this.onDigitPress('2') },
      { text: '3', color: '#474541', textColor: '#fff', func: this.onDigitPress('3') },
      this.getOperationLayoutData(Operations.ADD),
    ],
    [
      { text: '0', color: '#474541', textColor: '#fff', func: this.onDigitPress('0'), widthMult: 2 },
      { text: ',', color: '#474541', textColor: '#fff', func: this.onCommaPress },
      { text: '=', color: 'orange', textColor: '#fff', func: this.onResultPress },
    ]
  ]

  renderButton = (key, cellData) => {
    return (
      <TouchableOpacity
        key={key}
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: BUTTON_SIZE,
          width: cellData.widthMult > 1 ? cellData.widthMult * BUTTON_SIZE + (cellData.widthMult - 1) * BUTTON_MARGIN : BUTTON_SIZE,
          backgroundColor: cellData.color,
          borderRadius: BUTTON_SIZE / 2,
          marginLeft: BUTTON_MARGIN
        }}
        onPress={cellData.func}
      >
        <View style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 30, color: cellData.textColor }}>{cellData.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderRow = (key, rowData) => {
    return (
      <View key={key} style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: BUTTON_MARGIN
      }}>
        {rowData.map((cell, index) => this.renderButton(index, cell))}
      </View>
    )
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          marginHorizontal: INPUT_HORIZONTAL_MARGIN
        }}>
          <Text
            style={{ color: '#fff', fontSize: this.state.inputFontSize, position: 'absolute' }}
            onLayout={({ nativeEvent: { layout: { width: textWidth } } }) => {
              if ((textWidth + 2 * INPUT_HORIZONTAL_MARGIN) > width) {
                this.setState({ inputFontSize: this.state.inputFontSize - 1 })
              }
            }}
          >
            {this.showValue()}
          </Text>
        </View>
        <View style={{ justifyContent: 'space-around', paddingBottom: BUTTON_MARGIN }}>
          {this.getLayout().map((rowData, index) => this.renderRow(index, rowData))}
        </View>
      </View>
    )
  }
}