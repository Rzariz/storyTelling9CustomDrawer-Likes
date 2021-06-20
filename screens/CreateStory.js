import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
    Button,
    Alert
} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
//import { ScrollView } from 'react-native-gesture-handler'
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import DropDownPicker from 'react-native-dropdown-picker'
import firebase from "firebase";

let customFonts = { 'Bubblegum-Sans': require("../assets/fonts/BubblegumSans-Regular.ttf") }

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            previewImage: 'image_1',
            dropdownHeight: 40,
            light_theme: true
        }
    }
    async loadFontAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true })
    }
    async fetchUser() {
        let theme;
        await firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", (snapshot) => {
                theme = snapshot.val().current_theme;
                this.setState({ light_theme: theme === "light" });
            });

    }
    componentDidMount() {
        this.loadFontAsync();
        this.fetchUser();
    }
    async addStory() {
        console.log("Test")
        if (this.state.title &&
            this.state.description &&
            this.state.story &&
            this.state.moral) {

            let storyData = {
                preview_image: this.state.previewImage,
                title: this.state.title,
                description: this.state.description,
                story: this.state.story,
                moral: this.state.moral,
                author: firebase.auth().currentUser.displayName,
                created_on: new Date(),
                author_uid: firebase.auth().currentUser.uid,
                likes: 0
            }
            await firebase
                .database()
                .ref(
                    "/posts/" + Math.random().toString(36).slice(2)
                )
                .set(storyData)
                .then(function (snapshot) { });
                this.props.setUpdateToTrue();
            this.props.navigation.navigate("Feed");
        }
        else {
            Alert.alert(
                "Error", "All fields are required!",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }
    }
    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />
        }
        else {

            let preview_image = {
                'image_1': require("../assets/story_image_2.png"),
                'image_2': require("../assets/story_image_1.png"),
                'image_3': require("../assets/story_image_3.png"),
                'image_4': require("../assets/story_image_4.png"),
                'image_5': require("../assets/story_image_5.png"),
            }
            return (
                <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                            <Image
                                source={require("../assets/logo.png")}
                                style={styles.iconImage}></Image>
                        </View>
                        <View style={styles.appTitleTextContainer}>
                            <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}> New Story </Text>
                        </View>
                    </View>

                    <View style={styles.fieldContainer}>
                        <ScrollView>
                            <Image
                                source={preview_image[this.state.previewImage]}
                                style={styles.previewImage} />
                            <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                                <DropDownPicker
                                    items={[
                                        { label: "Image 1", value: "image_1" },
                                        { label: "Image 2", value: "image_2" },
                                        { label: "Image 3", value: "image_3" },
                                        { label: "Image 4", value: "image_4" },
                                        { label: "Image 5", value: "image_5" }
                                    ]}
                                    style={{ inputAndroid: { color: 'white' } }}
                                    useNativeAndroidDropDownPickerStyle={false}

                                    closeAfterSelecting={true}
                                    searchable={true}
                                    iconContainerStyle={{
                                        marginRight: 10
                                    }}
                                    showTickIcon={true}
                                    textStyle={{
                                        fontSize: 15,
                                        color: "red"
                                    }}
                                    placeholder="Select your image"
                                    placeholderStyle={{
                                        color: "red",
                                        fontWeight: "bold"
                                    }}
                                    defaultValue={this.state.previewImage}
                                    containerStyle={{
                                        height: 40,
                                        borderRadius: 20,
                                        marginBottom: 10
                                    }}
                                    style={{ backgroundColor: "white" }}
                                    itemStyle={{ justifyContent: "flex-start" }}
                                    dropDownStyle={{ backgroundColor: this.state.light_theme ? "#eee" : '#2f345d' }}
                                    labelStyle={this.state.light_theme ? styles.dropdownLabelLight : styles.dropdownLabel}
                                    arrowStyle={this.state.light_theme ? styles.dropdownLabelLight : styles.dropdownLabel}
                                    onOpen={() => {
                                        this.setState({ dropdownHeight: 200 });
                                    }}
                                    onClose={() => {
                                        this.setState({ dropdownHeight: 40 });
                                    }}
                                    onChangeItem={item =>
                                        this.setState({ previewImage: item.value })} />
                            </View>


                            <TextInput style={this.state.light_theme ? styles.inputFontLight : styles.inputFont}
                                onChangeText={title => this.setState({ title })}
                                placeholder={"Title"}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"} />
                            <TextInput
                                style={[this.state.light_theme ? styles.inputFontLight : styles.inputFont,
                                styles.inputFontExtra,
                                styles.inputTextBig
                                ]}
                                onChangeText={description => this.setState({ description })}
                                placeholder={"Description"}
                                multiline={true}
                                numberOfLines={4}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                            />
                            <TextInput
                                style={[this.state.light_theme ? styles.inputFontLight : styles.inputFont,
                                styles.inputFontExtra,
                                styles.inputTextBig
                                ]}
                                onChangeText={story => this.setState({ story })}
                                placeholder={"Story"}
                                multiline={true}
                                numberOfLines={20}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                            />

                            <TextInput
                                style={[this.state.light_theme ? styles.inputFontLight : styles.inputFont,
                                styles.inputFontExtra,
                                styles.inputTextBig
                                ]}
                                onChangeText={moral => this.setState({ moral })}
                                placeholder={"Moral of the story"}
                                multiline={true}
                                numberOfLines={4}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                            />

                        </ScrollView>
                        <View style={styles.submitButton}>
                            <Button
                                onPress={() => this.addStory()}
                                title="Submit"
                                color="#841584"
                            />
                        </View>

                    </View>
                    <View style={{ flex: 0.08 }} />
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#15193c"
    },
    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row"
    },
    appIcon: {
        flex: 0.3,
        justifyContent: "center",
        // alignItems: "center"
    },
    iconImage: {
        width: "100%",
        height: "100%",
        marginLeft: 10,
        resizeMode: "contain"
    },
    appTitleTextContainer: {
        flex: 0.7,
        justifyContent: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
    },
    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
    },
    fieldContainer: {
        flex: 0.85
    },
    previewImage: {
        width: "93%",
        height: RFValue(250),
        alignSelf: "center",
        borderRadius: RFValue(10),
        marginVertical: RFValue(10),
        resizeMode: "contain"
    },
    inputFont: {
        height: RFValue(40),
        borderColor: "white",
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: "white",
        fontFamily: "Bubblegum-Sans"
    },
    inputFontLight: {
        height: RFValue(40),
        borderColor: "black",
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: "black",
        fontFamily: "Bubblegum-Sans"
    },
    inputFontExtra: {
        marginTop: RFValue(15)
    },
    inputTextBig: {
        textAlignVertical: "top",
        padding: RFValue(5)
    },
    submitButton: {
        marginTop: RFValue(20),
        alignItems: "center",
        justifyContent: "center"
    }
})