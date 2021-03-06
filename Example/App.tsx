/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Basic from './examples/Basic'
import Examples from './screens/Examples'
import FlatList from './examples/FlatList'
import Horizontal from './examples/Horizontal'
import Derived from './examples/Derived'
import Imperative from './examples/Imperative'

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Examples}
          options={{ title: 'Holy Sheet Examples 😇' }}
        />
        <Stack.Screen name="Basic" component={Basic} options={{ title: 'Basic' }} />
        <Stack.Screen name="FlatList" component={FlatList} />
        <Stack.Screen
          name="Horizontal"
          component={Horizontal}
          options={{ title: 'Horizontal Scroll' }}
        />
        <Stack.Screen
          name="Derived"
          component={Derived}
          options={{ title: 'Derived Value' }}
        />
        <Stack.Screen
          name="Imperative"
          component={Imperative}
          options={{ title: 'Imperative Snap To' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
