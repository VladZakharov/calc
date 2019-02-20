import React from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

const { width, height } = Dimensions.get('window')

const Operations = {
  ADD: 1,
  SUB: 2,
  MULT: 3,
  DIV: 4
}

const ShowValue = {
  INPUT: 1,
  MEMORIZED: 2
}

export default class MainScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      memorizedValue: undefined,
      value: 0,
      result: undefined,
      operation: undefined,
      showValue: ShowValue.INPUT,
      valueIsPositive: true,
      memorizedValueIsPositive: true,
      fract: false
    }
  }

  reset = () => {
    this.setState(this.getInitialState())
  }

  changeSign = () => {
    const name = this.getShowValueName()
    const isPositive = this.state[`${name}IsPositive`]
    this.setState({ [`${name}IsPositive`]: !isPositive })
  }

  percentage = () => {
    const name = this.getShowValueName()
    const value = this.state[name]
    this.setState({ [name]: value * 0.01 })
  }

  typeFract = () => {
    this.setState({ fract: true })
  }

  typeDigit = (digit) => () => {
    const { value, fract } = this.state
    let newValue
    let newFract = fract
    if (parseFloat(value) === 0) {
      newValue = digit
    } else {
      newValue = parseFloat(`${value}${digit}`)
    }
    if (fract) {
      newValue = newValue / 10
      newFract = false
    }
    this.setState({ value: newValue, showValue: ShowValue.INPUT, fract: newFract })
  }

  makeOperation = (operation) => () => {
    this.setState({
      operation,
      value: 0,
      valueIsPositive: true,
      memorizedValue: this.state.value,
      memorizedValueIsPositive: this.state.valueIsPositive,
      showValue: ShowValue.MEMORIZED,
    })
  }

  result = () => {
    const { operation } = this.state
    let value
    const val1 = this.getSignedValue('memorizedValue')
    const val2 = this.getSignedValue('value')
    switch (operation) {
      case Operations.ADD:
        value = val1 + val2
        break
      case Operations.SUB:
        value = val1 - val2
        break
      case Operations.MULT:
        value = val1 * val2
        break
      case Operations.DIV:
        value = val1 / val2
        break
    }
    this.setState({
      value,
      memorizedValue: undefined,
      showValue: ShowValue.INPUT,
      operation: undefined,
    })
  }

  getShowValueName = () => {
    switch (this.state.showValue) {
      case ShowValue.INPUT:
        return 'value'
      case ShowValue.MEMORIZED:
        return 'memorizedValue'
    }
  }

  getSignedValue = (name) => {
    const isPositive = this.state[`${name}IsPositive`]
    const result = this.state[name]
    return isPositive ? result : -result
  }

  showValue = () => {
    const name = this.getShowValueName()
    const isPositive = this.state[`${name}IsPositive`]
    const result = this.state[name]
    const signedResult = isPositive ? `${result}` : `-${result}`
    return `${signedResult.replace('.', ',')}${this.state.fract ? ',' : ''}`
  }

  layout = [
    [
      { text: 'C', color: 'grey', textColor: '#474541', func: this.reset },
      { text: '±', color: 'grey', textColor: '#474541', func: this.changeSign },
      { text: '%', color: 'grey', textColor: '#474541', func: this.percentage },
      { text: '÷', color: 'orange', textColor: '#fff', func: this.makeOperation(Operations.DIV) },
    ],
    [
      { text: '7', color: '#474541', textColor: '#fff', func: this.typeDigit(7) },
      { text: '8', color: '#474541', textColor: '#fff', func: this.typeDigit(8) },
      { text: '9', color: '#474541', textColor: '#fff', func: this.typeDigit(9) },
      { text: '×', color: 'orange', textColor: '#fff', func: this.makeOperation(Operations.MULT) },
    ],
    [
      { text: '4', color: '#474541', textColor: '#fff', func: this.typeDigit(4) },
      { text: '5', color: '#474541', textColor: '#fff', func: this.typeDigit(5) },
      { text: '6', color: '#474541', textColor: '#fff', func: this.typeDigit(6) },
      { text: '-', color: 'orange', textColor: '#fff', func: this.makeOperation(Operations.SUB) },
    ],
    [
      { text: '3', color: '#474541', textColor: '#fff', func: this.typeDigit(3) },
      { text: '2', color: '#474541', textColor: '#fff', func: this.typeDigit(2) },
      { text: '1', color: '#474541', textColor: '#fff', func: this.typeDigit(1) },
      { text: '+', color: 'orange', textColor: '#fff', func: this.makeOperation(Operations.ADD) },
    ],
    [
      { text: '0', color: '#474541', textColor: '#fff', func: this.typeDigit(0), widthMult: 2 },
      { text: ',', color: '#474541', textColor: '#fff', func: this.typeFract },
      { text: '=', color: '#474541', textColor: '#fff', func: this.result },
    ]
  ]

  getButtonSize = () => {
    return height > width ? width / 5 : height / 5
  }

  getButtonMargin = () => {
    return this.getButtonSize() / 5
  }

  renderButton = (key, cellData) => {
    const size = this.getButtonSize()
    const margin = this.getButtonMargin()
    return (
      <TouchableOpacity
        key={key}
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: size,
          width: cellData.widthMult > 1 ? cellData.widthMult * size + (cellData.widthMult - 1) * margin : size,
          backgroundColor: cellData.color,
          borderRadius: size / 2,
          marginLeft: margin
        }}
        onPress={cellData.func}
      >
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
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
        marginTop: this.getButtonMargin()
      }}>
        {
          rowData.map((cell, index) => {
            return this.renderButton(index, cell)
          })
        }
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
          marginHorizontal: 30
        }}>
          <Text style={{ color: '#fff', fontSize: 70 }}>
            {this.showValue()}
          </Text>
        </View>
        <View style={{ justifyContent: 'space-around', paddingBottom: this.getButtonMargin() }}>
          {
            this.layout.map((rowData, index) => {
              return this.renderRow(index, rowData)
            })
          }
        </View>
      </View>
    )
  }
}