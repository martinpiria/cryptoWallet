import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import LMBackButton from '../../component/common/LMBackButton';

export default function TermsAndConditionsScreen({ navigation, route }) {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <LMBackButton color={'black'} onPress={() => {
                    navigation.goBack();
                }} />
            </View>
            <View style={{ flex: 1 }}>
                <WebView
                    source={{
                        html: '<html><head>\n' +
                            '  <meta charset="utf-8">\n' +
                            '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                            '  <title>Welcome file</title>\n' +
                            '  <link rel="stylesheet" href="https://stackedit.io/style.css">\n' +
                            '</head>\n' +
                            '\n' +
                            '<body class="stackedit">\n' +
                            '  <div class="stackedit__html"><h1 id="terms-of-use">TERMINOS Y CONDICIONES</h1>\n' +
                            '<p>Ultima actualizacion: setiembre, 2021</p>\n' +
                            '\n' +
                            '\n' +
                            '\n' +
                            '</body></html>'
                    }}
                />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff'
    },
    header: {
        height: 50,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    listContainer: {
        paddingLeft: 5,
        paddingRight: 5,
        flex: 1,
        alignItems: 'center'
    },
    logoContainer: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        width: '80%',
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    btn: {
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#4944c4',
        marginBottom: 5,
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#d5d5d5'
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
});
