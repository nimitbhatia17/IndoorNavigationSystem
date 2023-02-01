import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, Image } from "react-native";
const ngrokUrl = 'bbcf-14-139-234-179.in';

const SearchPage = () => {
    const [clicked, setClicked] = useState("true");
    const [searchPhrase, setSearchPhrase] = useState(" ");

    const navigation = useNavigation();
    function navigateToHome() {
        setSearchPhrase(" ")
        navigation.navigate("Path");

    }
    function sendRequest() {
        fetch('https://' + ngrokUrl + '.ngrok.io/getBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': 'token-value',
            },
            body: JSON.stringify(searchPhrase),
        })
            .then(resp => resp.json())
            .then(bookList => console.log(bookList));
    }
    return (

        <View style={styles.container}>
            <View
                style={
                    clicked
                        ? styles.searchBar__clicked
                        : styles.searchBar__unclicked
                }
            >
                {/* search Icon */}
                <Image
                    source={require('../../Images/searchIcon.png')}
                    style={{ width: "8%", height: "50%", marginLeft: 10 }}
                />
                {/* Input field */}
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={searchPhrase}
                    onChangeText={setSearchPhrase}
                    onFocus={() => {
                        setClicked(true);
                    }}
                />
                {/* cross Icon, depending on whether the search bar is clicked or not */}

                {/* {clicked && (
                    <Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
                        setSearchPhrase(" ")
                    }} />
                )}  */}
            </View>
            {
                clicked && (
                    <Button
                        title="Search"
                        onPress={() => {
                            sendRequest();
                            navigateToHome();
                        }}
                    />
                )
            }
            {/* cancel button, depending on whether the search bar is clicked or not */}
            {/* {clicked && (
                <View>
                    <Button
                        title="Cancel"
                        onPress={() => {
                            Keyboard.dismiss();
                            setClicked(false);
                        }}
                    ></Button>
                </View>
            )} */}
        </View>
    );
};
export default SearchPage;

// styles
const styles = StyleSheet.create({
    SubmitButtonStyle: {
        marginTop: "10%",
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#00BCD4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00BCD4",

    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "95%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 15,
        marginLeft: 10,
        width: "90%",
    },
});
