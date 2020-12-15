import React from 'react'
import { SafeAreaView, StyleSheet, View, Text, StatusBar, FlatList } from 'react-native'
import BottomSheet from '../components/BottomSheet'

const Horizontal = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, backgroundColor: 'blue' }}>
          <BottomSheet
            snapPoints={[50, 300, 600]}
            initialSnapIndex={1}
            containerStyle={{ paddingTop: 10 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={`flatlist-${i}`} style={{ marginVertical: 10 }}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={Array.from({ length: 100 }).map((_, i) => ({
                    id: i.toString(),
                    text: `Item ${i}`,
                  }))}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.flatlistItem}>
                      <Text style={styles.flatlistItemText}>{item.text}</Text>
                    </View>
                  )}
                />
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
  flatlistItem: {
    padding: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistItemText: {
    color: 'white',
    textAlign: 'center',
  },
})

export default Horizontal
