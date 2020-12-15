import React from 'react'
import { SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native'
import BottomSheet from '../components/BottomSheet'

const FlatList = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, backgroundColor: 'blue' }}>
          <BottomSheet
            snapPoints={[50, 300, 600]}
            initialSnapIndex={1}
            flatListProps={{
              data: Array.from({ length: 100 }).map((_, i) => ({
                id: i.toString(),
                text: `Item ${i}`,
              })),
              keyExtractor: (item) => item.id,
              renderItem: ({ item }) => (
                <View style={styles.flatlistItem}>
                  <Text style={styles.flatlistItemText}>{item.text}</Text>
                </View>
              ),
            }}
          />
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
  flatlistItem: {
    padding: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 6,
  },
  flatlistItemText: {
    color: 'white',
    textAlign: 'center',
  },
})

export default FlatList
