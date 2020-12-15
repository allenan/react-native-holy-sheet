import React from 'react'
import { SafeAreaView, StyleSheet, View, Text, StatusBar, TouchableOpacity, ScrollView } from 'react-native'

const ExampleLink = ({ name, onPress }: { name: string; onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.link}>
      <Text style={styles.linkText}>{name}</Text>
    </TouchableOpacity>
  )
}

const Examples = ({ navigation }) => {
  const navigate = (screen) => navigation.navigate(screen)

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView style={styles.scroll}>
            <ExampleLink name="Basic" onPress={() => navigate('Basic')} />
            <ExampleLink name="FlatList" onPress={() => navigate('FlatList')} />
            <ExampleLink name="Horizontal Scroll" onPress={() => navigate('Horizontal')} />
            <ExampleLink name="Derived Value Animation" onPress={() => navigate('Derived')} />
            <ExampleLink name="Imperative Snap To" onPress={() => navigate('Imperative')} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scroll: {
    paddingTop: 20,
  },
  link: {
    backgroundColor: '#ccc',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  linkText: {
    fontSize: 18,
    textAlign: 'center',
  }
})

export default Examples
