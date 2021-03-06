import React from 'react'
import { SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native'
import BottomSheet from '../components/BottomSheet'

const Basic = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <BottomSheet snapPoints={[50, 300, 600]} initialSnapIndex={1}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View key={`item-${i}`} style={styles.item}>
                <Text style={styles.itemText}>Item {i}</Text>
              </View>
            ))}
          </BottomSheet>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  item: {
    padding: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 6,
  },
  itemText: {
    color: 'white',
    textAlign: 'center',
  },
})

export default Basic
