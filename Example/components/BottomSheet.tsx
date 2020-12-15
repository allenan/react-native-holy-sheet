import React, { useEffect, useRef, useState } from 'react'
import { FlatList, StyleProp, View, ViewStyle, ScrollView } from 'react-native'
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
} from 'react-native-reanimated'
import Header from './Header'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
const AnimatedTapGestureHandler = Animated.createAnimatedComponent(TapGestureHandler)

type Props = {
  snapPoints: number[]
  initialSnapIndex: number
  renderHeader?: () => React.ReactNode | false
  springConfig?: Animated.WithSpringConfig
  flatListProps?: FlatListProps
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
}

type FlatListProps = {
  data: any
  renderItem: any
  keyExtractor: (item: any) => any
}

const defaultProps: Props = {
  snapPoints: [0, 500],
  initialSnapIndex: 0,
  renderHeader: () => <Header />,
  springConfig: { stiffness: 500, damping: 25 },
  style: {},
  containerStyle: {},
}

const BottomSheet: React.FC<Props> = (props) => {
  const {
    snapPoints,
    initialSnapIndex,
    renderHeader,
    springConfig,
    flatListProps,
    style,
    containerStyle,
    children,
  } = props

  // trigger a re-render on mount in order to get maxDeltaY
  // on the outer tap gesture handler to register ¯\_(ツ)_/¯
  const [_, triggerRerender] = useState(false)
  useEffect(() => {
    triggerRerender(true)
  }, [])

  const maxSnap = snapPoints[snapPoints.length - 1]

  const tapRef = useRef()
  const headerRef = useRef()
  const panRef = useRef()
  const scrollRef = useRef()

  const translation = useSharedValue(-snapPoints[initialSnapIndex])
  const snapIndex = useSharedValue(initialSnapIndex)
  const lastSnap = useSharedValue(snapPoints[initialSnapIndex])
  const scrollOffset = useSharedValue(0)

  // spring the sheet to a snap point referenced by index
  function setSnapPoint(index: number) {
    'worklet'

    function clamp(number: number, min: number, max: number): number {
      return Math.min(max, Math.max(min, number))
    }

    const clampedIndex = clamp(index, 0, snapPoints.length - 1)

    snapIndex.value = clampedIndex
    lastSnap.value = snapPoints[clampedIndex]
    translation.value = withSpring(-snapPoints[clampedIndex], springConfig)
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_event, ctx) => {
      // store the starting y position and the scroll offset in the
      // context object for future refernce in this gesture
      ctx.startY = translation.value
      ctx.offsetY = scrollOffset.value
    },
    onActive: (event, ctx) => {
      // the next translation value is the sum of the starting
      // y position and the gesture in the translation
      let nextValue = ctx.startY + event.translationY

      if (event.translationY > 0) {
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
    onEnd: (event, ctx) => {
      if (event.translationY > 0 && ctx.offsetY - event.translationY > 0) {
        // if we're gesturing down, but we haven't scrolled the scrollview
        // all the way back to the top, then don't snap
        return
      }

      // snap to the next snap point
      if (event.translationY < 0) {
        setSnapPoint(snapIndex.value + 1)
      } else {
        setSnapPoint(snapIndex.value - 1)
      }
    },
  })

  const headerGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translation.value
    },
    onActive: (event, ctx) => {
      // gestures on the header should move the sheet no matter what
      translation.value = ctx.startY + event.translationY
    },
    onEnd: (event) => {
      // snap to the next snap point
      if (event.translationY < 0) {
        setSnapPoint(snapIndex.value + 1)
      } else {
        setSnapPoint(snapIndex.value - 1)
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
          data={flatListProps.data}
          renderItem={flatListProps.renderItem}
          keyExtractor={flatListProps.keyExtractor}
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
      <View pointerEvents="box-none" style={{ flex: 1 }}>
        <Animated.View style={[{ flex: 1 }, animatedStyles]}>
          <View
            style={[
              {
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 10,
                position: 'absolute',
                left: 0,
                right: 0,
                height: 2000,
                bottom: -2000,
              },
              style,
            ]}
          >
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
}

BottomSheet.defaultProps = defaultProps

export default BottomSheet
