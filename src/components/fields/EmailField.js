import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'

const EmailField = ({ onInputChange, value, validity }) => {
    return <View style={{ ...styles.container, borderColor: validity ? null : 'red', borderWidth: validity ? null : 2 }}>
        <TextInput
            style={styles.inputContainer}
            placeholder='Correo Electrónico'
            value={value}
            placeholderTextColor={'#a2a2a2'}
            color={'#a2a2a2'}
            keyboardType={'email-address'}
            onChangeText={t => { onInputChange(t) }}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#363636',
        width: '100%',
        borderRadius: 3,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 7
    },
    inputContainer: {
        flex: 1,
    }
})

export default EmailField;