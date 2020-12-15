import React, { useRef } from 'react'
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Button } from 'react-native'
import BottomSheet from '../components/BottomSheet'

const Imperative = () => {
  type BottomSheetHandle = React.ElementRef<typeof BottomSheet>
  const sheet = useRef<BottomSheetHandle>(null)
  const handlePress = (index: number) => {
    sheet.current?.snapTo(index)
  }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Button title="Snap To 0" onPress={() => handlePress(0)} color="#fff" />
            <Button title="Snap To 1" onPress={() => handlePress(1)} color="#fff" />
            <Button title="Snap To 2" onPress={() => handlePress(2)} color="#fff" />
          </View>

          <BottomSheet ref={sheet} snapPoints={[50, 300, 600]} initialSnapIndex={1}>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    backgroundColor: '#ccc'
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

export default Imperative
