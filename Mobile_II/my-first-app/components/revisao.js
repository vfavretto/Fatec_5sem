import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Campos = () => {
    const [nome, setNome] = useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Digite seu nome:</Text>
            <TextInput
                onChangeText={(Text)=> {setNome(Text)}}
                placeholder="Digite seu nome"
                style={styles.input}
            />
            <Text style={styles.result}>
                {nome ? `Olá, ${nome}!` : 'Aguardando...'}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        maxWidth: 300,
        height: 50,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    result: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default Campos;
