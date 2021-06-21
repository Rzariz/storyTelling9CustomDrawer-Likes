import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    SafeAreaView,
    ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase"

import * as Speech from "expo-speech";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};


export default class StoryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            speakerColor: "gray",
            speakerIcon: "volume-high-outline",
            light_theme: true
        };
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
    async loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this.loadFontsAsync();
        this.fetchUser();
    }
    async initiateTTS(title, author, story, moral) {
        const currColor = this.state.speakerColor;
        this.setState({
            speakerColor: currColor === "gray" ? 'red' : "gray"
        })
        if (currColor === "gray") {
            Speech.speak(`${title} by ${author}`);
            Speech.speak(story);
            Speech.speak("The moral of the story is !");
            Speech.speak(moral);
        }
        else {
            Speech.stop();
        }
    }
    render() {
        console.log(this.props.route.param)
        //let story = this.state.story_data;
        if (!this.props.route.params) {
            this.props.navigation.navigate("Home");
        }

        else if (!this.state.fontsLoaded) {
            return <AppLoading />
        }
        else {
            let images = {
                'image_1': require("../assets/story_image_1.png"),
                'image_2': require("../assets/story_image_2.png"),
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
                                source={require("../assets/logo.png")} style={styles.iconImage}></Image>
                        </View>
                        <View style={styles.appTitleTextContainer}>
                            <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}> Stories Hub </Text>
                        </View>
                    </View>
                    <View style={styles.storyContainer}>
                        <ScrollView style={this.state.light_theme ? styles.storyCardLight : styles.storyCard}>
                            <Image
                                source={images[this.props.route.params.story.preview_image]}
                                style={styles.image} />
                            <View style={styles.dataContainer}>
                                <View style={styles.titleTextContainer}>
                                    <Text style={this.state.light_theme ? styles.storyTitleTextLight : styles.storyTitleText}>
                                        {this.props.route.params.story.title}
                                    </Text>
                                    <Text style={this.state.light_theme ? styles.storyAuthorTextLight : styles.storyAuthorText}>
                                       By : {this.props.route.params.story.author}
                                    </Text>
                                    <Text style={this.state.light_theme ? styles.descriptionTextLight : styles.descriptionText}>
                                        Date : {this.props.route.params.story.created_on}
                                    </Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.initiateTTS(
                                                this.props.route.params.story.title,
                                                this.props.route.params.story.author,
                                                this.props.route.params.story.story,
                                                this.props.route.params.story.moral
                                            )
                                        }>
                                        <Ionicons
                                            name={this.state.speakerIcon}
                                            size={RFValue(30)}
                                            color={this.state.speakerColor}
                                            style={{ margin: RFValue(15) }}
                                        />
                                    </TouchableOpacity>

                                </View>
                            </View>


                            <View style={styles.storyTextContainer}>
                                <Text style={this.state.light_theme ? styles.storyTextLight : styles.storyText}>
                                    {this.props.route.params.story.story +'\n'}
                                </Text>
                                <Text style={this.state.light_theme ? styles.moralTextLight : styles.moralText}>
                                    Moral - {this.props.route.params.story.moral}
                                </Text>
                            </View>
                            <View style={styles.actionContainer}>
                                <View style={styles.likeButton}>
                                    <Ionicons name={"heart"} size={RFValue(30)} color={this.state.light_theme ? "black" : "white"} />
                                    <Text style={this.state.light_theme ? styles.likeTextLight : styles.likeText}>12k</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>

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
        alignItems: "center"
    },
    iconImage: {
        width: "100%",
        height: "100%",
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
    storyContainer: {
        flex: 1
    },
    storyCard: {
        margin: RFValue(20),
        backgroundColor: "#2f345d",
        borderRadius: RFValue(20)
    },
    storyCardLight: {
        margin: RFValue(20),
        backgroundColor: "white",
        borderRadius: RFValue(20),
        borderWidth: 2
    },
    image: {
        width: "100%",
        alignSelf: "center",
        height: RFValue(200),
        borderTopLeftRadius: RFValue(20),
        borderTopRightRadius: RFValue(20),
        resizeMode: "contain"
    },
    dataContainer: {
        flexDirection: "row",
        padding: RFValue(20)
    },
    titleTextContainer: {
        flex: 0.8
    },
    storyTitleText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        color: "white"
    },
    storyTitleTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        color: "black"
    },
    storyAuthorText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(18),
        color: "white"
    },
    storyAuthorTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(18),
        color: "coral"
    },
    iconContainer: {
        flex: 0.2
    },
    storyTextContainer: {
        padding: RFValue(20)
    },

    storyText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(15),
        color: "white"
    },
    storyText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(15),
        color: "black"
    },
    moralText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(20),
        color: "white"
    },
    moralTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(20),
        color: "green"
    },
    actionContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: RFValue(10)
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        flexDirection: "row",
        backgroundColor: "#eb3948",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(30)
    },
    likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
    },
    likeTextLight: {
        //color: "black",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
    },
    descriptionText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 13,
        color: "white",
        paddingTop: RFValue(10)
    },
    descriptionTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 13,
        color: "black",
        paddingTop: RFValue(10)
    },
});
