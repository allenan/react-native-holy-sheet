import React from 'react'
import { SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native'
import BottomSheet from '../components/BottomSheet'

const Basic = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, backgroundColor: 'blue' }}>
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
  container: {
    flex: 1,
    backgroundColor: 'red',
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
