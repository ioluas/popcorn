import {Dispatch, JSX, SetStateAction} from 'react'
import {StyleSheet, Text, TouchableOpacity} from "react-native";

type CounterButtonProps = {
    type: 'increment' | 'decrement'
    value: number
    amount: number
    setter: Dispatch<SetStateAction<number>>
    customFormatter?: (value: number) => string
}

export default function CounterButton(props: CounterButtonProps): JSX.Element {
    const content = `${props.type === 'increment' ? '+' : '-'}${props.amount > 1 ? props.amount : ''}`
    const formatter = props.customFormatter ?? ((value: number) => value.toString())
    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            if (props.type === 'increment') {
                props.setter(props.value + props.amount)
                return
            }
            props.setter(Math.max(1, props.value - props.amount))
        }}>
            <Text style={styles.counterButton}>{content}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 36,
        height: 36,
        backgroundColor: '#5d6d7a',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButton: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '400',
    }
})