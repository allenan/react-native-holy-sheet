import React from 'react'
import { View, StyleSheet } from 'react-native'

const Header = () => (
  <View style={styles.header}>
    <View style={styles.handle} />
  </View>
)

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#eff3f7',
  }
})

export default Header
