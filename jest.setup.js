/* globals jest */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native')
  return {
    Ionicons: ({ name, ...props }) => <Text {...props}>{name}</Text>,
  }
})
