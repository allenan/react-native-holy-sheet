
# Holy Sheet 😇

A silky smooth, scrolling bottom sheet component

## Installation

Install the library:

```
yarn add react-native-holy-sheet@alpha
```

Install peer dependencies:

```
yarn add react-native-gesture-handler react-native-reanimated@alpha
```

Because this uses the alpha version 2 of `react-native-reanimated`, the following additional configuration is required:

Add the following plugin to your .babelrc:

```
module.exports = {
  plugins: ['react-native-reanimated/plugin'],
}
```

For iOS:

```
npx pod-install
```

## Usage

### Basic example with ScrollView

```js
<BottomSheet snapPoints={[50, 300, 600]} initialSnapIndex={1}>
  {Array.from({ length: 10 }).map((_, i) => (
    <View key={`item-${i}`} style={styles.item}>
      <Text style={styles.itemText}>Item {i}</Text>
    </View>
  ))}
</BottomSheet>
```

### FlatList

```js
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
```

See the example app for additional usage.
