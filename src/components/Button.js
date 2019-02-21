import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BUTTON_MARGIN, BUTTON_SIZE } from '../consts'

export const Button = (props) => {
  const { widthMult, color, text, textColor, func } = props
  return (
    <TouchableOpacity
      style={[
        styles.buttonCover,
        {
          width: widthMult > 1 ? widthMult * BUTTON_SIZE + (widthMult - 1) * BUTTON_MARGIN : BUTTON_SIZE,
          backgroundColor: color
        }
      ]}
      onPress={func}
    >
      <View style={styles.buttonContainer}>
        <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonCover: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    marginLeft: BUTTON_MARGIN
  },
  buttonContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 30
  }
})