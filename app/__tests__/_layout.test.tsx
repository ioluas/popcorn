import { ReactNode } from 'react'
import { render } from '@testing-library/react-native'
import RootLayout from '../_layout'

jest.mock('expo-router', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native')
  return {
    Stack: ({ screenOptions, children }: { screenOptions: object; children?: ReactNode }) => (
      <View testID="stack" {...{ screenOptions }}>
        {children}
      </View>
    ),
  }
})

describe('RootLayout', () => {
  it('renders Stack component', () => {
    const { getByTestId } = render(<RootLayout />)
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('hides header', () => {
    const { getByTestId } = render(<RootLayout />)
    const stack = getByTestId('stack')
    expect(stack.props.screenOptions.headerShown).toBe(false)
  })

  it('sets background color to dark theme', () => {
    const { getByTestId } = render(<RootLayout />)
    const stack = getByTestId('stack')
    expect(stack.props.screenOptions.contentStyle.backgroundColor).toBe('#242424')
  })
})
