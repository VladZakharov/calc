import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { BUTTON_MARGIN, Colors, DEFAULT_FONT_SIZE, INPUT_HORIZONTAL_MARGIN, MAX_INPUT_LENGTH } from './consts'
import { Button } from './components/Button'

const { width } = Dimensions.get('window')

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
  lastOperationFunc: null,
  inputFontSize: DEFAULT_FONT_SIZE
}

export default class MainScreen extends React.Component {
  state = initialState

  resetState = () => { this.setState(initialState) }

  onChangeSignPress = () => {
    const name = this.getShowValueName()
    const value = this.state[name]
    this.setState({ [name]: value.startsWith('-') ? value.slice(1) : `-${value}`, lastOperationFunc: null })
  }

  onPercentPress = () => {
    const name = this.getShowValueName()
    const value = this.state[name]
    this.setState({ [name]: (parseFloat(value) * 0.01).toString(), lastOperationFunc: null })
  }

  onCommaPress = () => {
    let { input } = this.state
    input = input || '0'
    this.setState({
      input: input.includes('.') ? input : `${input}.`,
      showValue: ShowValue.INPUT,
      lastOperationFunc: null
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
    this.setState({ input: newValue, showValue: ShowValue.INPUT, lastOperationFunc: null })
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
      showValue: ShowValue.MEMORIZED,
      lastOperationFunc: null
    })
  }

  onResultPress = async () => {
    let operationFunc = null
    if (!this.state.memorized || !this.state.input) {
      if (this.state.lastOperationFunc) {
        operationFunc = this.state.lastOperationFunc
      } else {
        this.setState({ operation: null })
        return
      }
    }
    const val1 = parseFloat(this.state.memorized || this.state.result)
    const val2 = parseFloat(this.state.input)
    const { operation } = this.state

    operationFunc = operationFunc || this.getOperationFunc(operation, val2)

    const result = operationFunc(val1)
    return new Promise((resolve) => {
      this.setState({
        result: result.toString(),
        input: '',
        memorized: '',
        showValue: ShowValue.RESULT,
        operation: null,
        lastOperationFunc: operationFunc // запоминаем последнюю операцию для реализации фичи нескольких нажатий "=" подряд
      }, resolve)
    })
  }

  getOperationFunc = (operation, val2) => (val1) => {
    let result
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
    return result
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
      color: isActive ? Colors.WHITE : Colors.ORANGE,
      textColor: isActive ? Colors.ORANGE : Colors.WHITE,
      func: this.onOperationPress(operation)
    }
  }

  getLayout = () => [
    [
      { text: 'C', color: Colors.GREY, textColor: Colors.DARK_GREY, func: this.resetState },
      { text: '±', color: Colors.GREY, textColor: Colors.DARK_GREY, func: this.onChangeSignPress },
      { text: '%', color: Colors.GREY, textColor: Colors.DARK_GREY, func: this.onPercentPress },
      this.getOperationLayoutData(Operations.DIV),
    ],
    [
      { text: '7', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('7') },
      { text: '8', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('8') },
      { text: '9', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('9') },
      this.getOperationLayoutData(Operations.MULT),
    ],
    [
      { text: '4', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('4') },
      { text: '5', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('5') },
      { text: '6', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('6') },
      this.getOperationLayoutData(Operations.SUB),
    ],
    [
      { text: '1', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('1') },
      { text: '2', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('2') },
      { text: '3', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('3') },
      this.getOperationLayoutData(Operations.ADD),
    ],
    [
      { text: '0', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onDigitPress('0'), widthMult: 2 },
      { text: ',', color: Colors.DARK_GREY, textColor: Colors.WHITE, func: this.onCommaPress },
      { text: '=', color: Colors.ORANGE, textColor: Colors.WHITE, func: this.onResultPress },
    ]
  ]

  renderRow = (key, rowData) => {
    return (
      <View key={key} style={styles.keyboardRow}>
        {rowData.map((cell, index) => <Button key={index} {...cell} />)}
      </View>
    )
  }

  textBlockOnLayout = ({ nativeEvent: { layout: { width: textWidth } } }) => {
    if ((textWidth + 2 * INPUT_HORIZONTAL_MARGIN) > width) {
      this.setState({ inputFontSize: this.state.inputFontSize - 1 })
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.displayBlock}>
          <Text
            style={[styles.displayText, { fontSize: this.state.inputFontSize }]}
            onLayout={this.textBlockOnLayout}
          >
            {this.showValue()}
          </Text>
        </View>
        <View style={styles.keyboardContainer}>
          {this.getLayout().map((rowData, index) => this.renderRow(index, rowData))}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  displayBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginHorizontal: INPUT_HORIZONTAL_MARGIN
  },
  displayText: {
    color: '#fff',
    position: 'absolute'
  },
  keyboardContainer: {
    justifyContent: 'space-around',
    paddingBottom: BUTTON_MARGIN
  },
  keyboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: BUTTON_MARGIN
  }
})