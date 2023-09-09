import { View, Text, StyleSheet } from 'react-native';

const LoginSuccessScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome you are login Sucess</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "#aaa"
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default LoginSuccessScreen;