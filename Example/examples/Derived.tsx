import React, { useImperativeHandle } from 'react'
import { SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native'
import Animated, {
  useDerivedValue,
  useSharedValue,
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import BottomSheet from '../components/BottomSheet'

const Derived = () => {
  const snapPoints = [50, 300, 600]
  const initialSnapIndex = 1

  const snapProgress = useSharedValue(0.5)

  const translateY = useDerivedValue(() => {
    return interpolate(snapProgress.value, [0.5, 1], [0, -300], Extrapolate.CLAMP)
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    }
  })

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View style={[styles.derived, animatedStyles]} />

          <BottomSheet snapPoints={snapPoints} initialSnapIndex={initialSnapIndex} snapProgress={snapProgress}>
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
  derived: {
    marginTop: 320,
    flex: 0.2,
    backgroundColor: 'green',
    marginHorizontal: 40,
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

export default Derived
