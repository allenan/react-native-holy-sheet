import React, { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  StyleProp,
  View,
  ViewStyle,
  ScrollView,
  StyleSheet,
  FlatListProps,
} from 'react-native'
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useDerivedValue,
} from 'react-native-reanimated'
import Header from './Header'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
const AnimatedTapGestureHandler = Animated.createAnimatedComponent(TapGestureHandler)

type Props<T = Object[]> = {
  snapPoints: number[]
  initialSnapIndex: number
  renderHeader?: () => React.ReactNode | false
  springConfig?: Animated.WithSpringConfig
  flatListProps?: FlatListProps<T>
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  snapProgress?: Animated.SharedValue<number>
  children?: any
}

const defaultProps: Props = {
  snapPoints: [0, 500],
  initialSnapIndex: 0,
  renderHeader: () => <Header />,
  springConfig: { stiffness: 500, damping: 25 },
  style: {},
  containerStyle: {},
}

function clamp(number: number, min: number, max: number): number {
  'worklet'

  return Math.min(max, Math.max(min, number))
}

type BottomSheetHandle = {
  snapTo: (index?: number) => void
}

const BottomSheet = React.forwardRef((props: Props, ref: React.Ref<BottomSheetHandle>) => {
  const {
    snapPoints,
    initialSnapIndex,
    renderHeader,
    springConfig,
    flatListProps,
    style,
    containerStyle,
    children,
    snapProgress,
  } = props

  // trigger a re-render on mount in order to get maxDeltaY
  // on the outer tap gesture handler to register ¯\_(ツ)_/¯
  const [_, triggerRerender] = useState<boolean>(false)
  useEffect(() => {
    triggerRerender(true)
  }, [])

  const maxSnap = snapPoints[snapPoints.length - 1]

  const tapRef = useRef<TapGestureHandler>(null)
  const headerRef = useRef<PanGestureHandler>(null)
  const panRef = useRef<PanGestureHandler>(null)
  const scrollRef = useRef<NativeViewGestureHandler>(null)

  const translation = useSharedValue<number>(-snapPoints[initialSnapIndex])
  const snapIndex = useSharedValue<number>(initialSnapIndex)
  const lastSnap = useSharedValue<number>(snapPoints[initialSnapIndex])
  const scrollOffset = useSharedValue<number>(0)
  const isSnapping = useSharedValue({ fromIndex: 0, toIndex: 0, active: false, hitTarget: false })

  React.useImperativeHandle(ref, () => ({
    snapTo(index?: number): void {
      snapTo(index || 0)
    },
  }))

  // if the invoking component passes in a snapProgress sharedValue, we will
  // derive that value from the sharedValues within this component
  if (snapProgress) {
    useDerivedValue(() => {
      if (isSnapping.value.active) {
        const fromSnap = snapPoints[isSnapping.value.fromIndex]
        const toSnap = snapPoints[isSnapping.value.toIndex]

        if (isSnapping.value.hitTarget) {
          return (snapProgress.value = toSnap / maxSnap)
        }

        if (toSnap > fromSnap && -translation.value >= toSnap) {
          // if snapping up and we've reached our target
          isSnapping.value = { ...isSnapping.value, hitTarget: true }
          return (snapProgress.value = toSnap / maxSnap)
        }

        if (toSnap < fromSnap && -translation.value <= toSnap) {
          // if snapping down and we've reached our target
          isSnapping.value = { ...isSnapping.value, hitTarget: true }
          return (snapProgress.value = toSnap / maxSnap)
        }
      }
      return (snapProgress.value = -translation.value / maxSnap)
    })
  }

  // spring the sheet to a snap point referenced by index
  function snapTo(index: number) {
    'worklet'

    const clampedIndex = clamp(index, 0, snapPoints.length - 1)

    isSnapping.value = {
      active: true,
      fromIndex: snapIndex.value,
      toIndex: clampedIndex,
      hitTarget: false,
    }
    snapIndex.value = clampedIndex
    lastSnap.value = snapPoints[clampedIndex]
    translation.value = withSpring(-snapPoints[clampedIndex], springConfig, (isFinished) => {
      if (isFinished) {
        isSnapping.value = { fromIndex: 0, toIndex: 0, active: false, hitTarget: false }
      }
    })
  }

  type GestureContext = {
    startY: number
    offsetY: number
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_event, ctx: GestureContext) => {
      // store the starting y position and the scroll offset in the
      // context object for future refernce in this gesture
      ctx.startY = translation.value
      ctx.offsetY = scrollOffset.value
    },
    onActive: (event, ctx: GestureContext) => {
      // the next translation value is the sum of the starting
      // y position and the gesture in the translation
      let nextValue = ctx.startY + event.translationY

      if (event.translationY > 0 && lastSnap.value === maxSnap) {
        // if we're gesturing down, take the scroll offset into
        // account so that the sheet doesn't move while scrolling
        // back to the top of the scrollview
        nextValue -= ctx.offsetY
      }

      if (-nextValue <= maxSnap) {
        // if we haven't reached the max snap point yet, translate
        translation.value = nextValue
      }
    },
    onEnd: (event, ctx: GestureContext) => {
      if (
        event.translationY > 0 &&
        ctx.offsetY - event.translationY > 0 &&
        lastSnap.value === maxSnap
      ) {
        // if we're gesturing down, but we haven't scrolled the scrollview
        // all the way back to the top, then don't snap
        return
      }

      // snap to the next snap point
      if (event.translationY < 0) {
        snapTo(snapIndex.value + 1)
      } else {
        snapTo(snapIndex.value - 1)
      }
    },
  })

  const headerGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: GestureContext) => {
      ctx.startY = translation.value
    },
    onActive: (event, ctx: GestureContext) => {
      // gestures on the header should move the sheet no matter what
      translation.value = ctx.startY + event.translationY
    },
    onEnd: (event) => {
      // snap to the next snap point
      if (event.translationY < 0) {
        snapTo(snapIndex.value + 1)
      } else {
        snapTo(snapIndex.value - 1)
      }
    },
  })

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // track the offset of the scrollview from the top
      scrollOffset.value = event.contentOffset.y
    },
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translation.value,
        },
      ],
    }
  })

  const tapProps = useAnimatedProps(() => ({
    maxDeltaY: maxSnap - lastSnap.value,
  }))

  const renderInner = () => {
    if (flatListProps) {
      return (
        <AnimatedFlatList
          {...flatListProps}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          bounces={false}
          contentContainerStyle={{
            paddingBottom: 1500,
          }}
        />
      )
    }

    return (
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 1500,
        }}
      >
        {children}
      </AnimatedScrollView>
    )
  }

  return (
    <AnimatedTapGestureHandler ref={tapRef} maxDurationMs={100000} animatedProps={tapProps}>
      <View pointerEvents="box-none" style={styles.outerContainer}>
        <Animated.View style={[styles.sheet, style, animatedStyles]}>
          <View>
            {renderHeader && (
              <PanGestureHandler ref={headerRef} onGestureEvent={headerGestureHandler}>
                <Animated.View>{renderHeader()}</Animated.View>
              </PanGestureHandler>
            )}
            <PanGestureHandler
              ref={panRef}
              simultaneousHandlers={[scrollRef, tapRef]}
              onGestureEvent={gestureHandler}
            >
              <Animated.View>
                <View style={[{ paddingHorizontal: 10 }, containerStyle]}>
                  <NativeViewGestureHandler
                    ref={scrollRef}
                    simultaneousHandlers={panRef}
                    waitFor={tapRef}
                  >
                    {renderInner()}
                  </NativeViewGestureHandler>
                </View>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </Animated.View>
      </View>
    </AnimatedTapGestureHandler>
  )
})

BottomSheet.defaultProps = defaultProps

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2000,
    bottom: -2000,
  },
})

export default BottomSheet
