import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, Image, FlatList, Text, TouchableHighlight } from "react-native";
import AppLoader from "../../components/AppLoader";
import { NGROK_URL } from "../../key";

const ngrokUrl = NGROK_URL;

const SearchPage = () => {
    const [clicked, setClicked] = useState("true");
    const [searchPhrase, setSearchPhrase] = useState("");
    const [books, setBooks] = useState([]);
    const [toggleList, setToggleList] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const navigation = useNavigation();
    const alignSelf = 'stretch';

    // navigation function
    function navigateToHome(props) {
        setSearchPhrase(" ")
        navigation.navigate("Home", { bookList: props });
    }

    const sendRequest = async () => {
        try {
            setShowLoader(true);
            await fetch('https://' + ngrokUrl + '.ngrok.io/getBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': 'token-value',
                },
                body: JSON.stringify(searchPhrase),
            })
                .then(resp => resp.json())
                .then((bookList) => {
                    setToggleList(true)
                    setBooks(bookList)
                });
            setShowLoader(false);

        } catch (err) {
            console.log(err);
        }
    }


    // render list of books
    const renderItem = item => {
        return (
            <TouchableHighlight onPress={() => navigateToHome(item)} underlayColor= "powderblue" style={{marginTop: 10, marginBottom: 10}}>

                <View
                    style={[
                        styles.box,
                        {
                            alignSelf,
                            width: 'auto',
                            minWidth: 50,
                            backgroundColor: 'powderblue',
                        },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            textAlign: 'center',
                            color: '#fff',
                            padding: 10
                        }}>
                        Book Name: {item["book_name"]}  |  Author Name: {item["author_name"]}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    };
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
                    placeholder="Enter Book Name"
                    value={searchPhrase}
                    onChangeText={setSearchPhrase}
                    onFocus={() => {
                        setClicked(true);
                    }}
                />
            </View>
            <View style={{ marginTop: "3%" }}>
                <Button
                    title="Search"
                    onPress={() => {
                        Keyboard.dismiss();
                        sendRequest();
                        setToggleList(true);
                    }}
                />
            </View>
            {
                !showLoader ?
                    <FlatList
                        data={books}
                        renderItem={({ item }) => renderItem(item)}
                    />
                    : <><AppLoader />
                    </>
            }

        </View>
    );
};
export default SearchPage;

// styles
const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: "40%",
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
