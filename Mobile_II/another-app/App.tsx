import React from "react";
import { View, Button, StyleSheet } from "react-native";

export default function App() {

    //const url = 'http://localhost:5000';
    const url = 'http://192.168.50.52:3000';


    const ExibirDados = () => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
    };

    return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Exibir Dados" onPress={ExibirDados} />
    </View>
    );
}