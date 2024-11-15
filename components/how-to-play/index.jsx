import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import Footer from '../footer';
import Header from '../header';



const Section = ({ title, content }) => (
    <View style={styles.section}>
        <Text style={styles.contentText}>
            <Text style={styles.mainContentText}>{title}</Text> {content}
        </Text>
    </View>
);

const SubSection = ({ content }) => (
    <View style={styles.subContent}>
        <Entypo name="dot-single" color="#858585" size={30} style={styles.bulletin} />
        <Text style={styles.subTextContent}>{content}</Text>
    </View>
);

const Index = () => {
  
    return (
        <View style={{flex:1}}>
            <Header />
        <ScrollView style={styles.main} contentContainerStyle={{ alignItems: "center" }}>
            <View style={styles.mainHeader}>
                <Text style={styles.headerText}>How to play</Text>
            </View>
            <View style={styles.content}>
                <Section
                    title="Selections : "
                    content="You may make your selections or change selections up until the beginning of the first game/matchup of each round. Simply click on the basketball icon next to the team you pick to win each matchup."
                />
                <Section
                    title="Scoring : "
                    content="The “seed” is the number 1-16 next to the team name in each matchup."
                />
                <SubSection
                    content="You will receive 5 points for each correct selection in the Play-In Round.You will receive the number of points equivalent to the seed of each correct selection in Rounds 1, 2 and 3, multiplied by the number of the Round (for instance, if you correctly pick #11 seed in Round 1 you receive 11 points – 11×1; if you correctly pick #5 seed in round 2 you receive 10 points – 5×2; if you correctly pick #7 seed in Round 3 you receive 21 points – 7×3)."
                />
                <SubSection
                    content="You will receive 25 points for each correct selection in Round 4, aka The Elite Eight."
                />
                <SubSection
                    content="You will receive 50 points for each correct selection in Round 5, aka The Final Four."
                />
                <SubSection
                    content="You can bet any, all or none of your total points on the Championship Game, and those points will be added to your total for a correct selection, or those points will be deleted from your total for an incorrect selection."
                />
                <Section
                    title="Tie-breaker : "
                    content="In case of a tie we will go to TOTAL NUMBER OF CORRECT SELECTIONS. If there is still a tie, we will go to MOST CORRECT UPSET (lower seed beats higher seed) SELECTIONS. If neither of those measures break the tie, the winner will be the highest bidder."
                />
            </View>
        </ScrollView>
        <Footer />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
        flex: 1,
        backgroundColor: "#f2f1ed",
    },
    mainHeader: {
        marginVertical: 15,
        width: "85%",
        backgroundColor: "#454134",
        borderRadius: 5,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    headerText: {
        fontFamily: "nova",
        fontSize: 18,
        textAlign: "center",
        color: "white",
        textTransform: "uppercase"
    },
    content: {
        flex: 1,
        width: "85%",
        height: "auto",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        display: "flex",
        gap: 10,
        paddingVertical: 35,
        paddingHorizontal: 40,
    },
    mainContentText: {
        // fontFamily: "nova",
        fontSize: 16,
        color: "black",
        fontWeight: "bold",
    },
    contentText: {
        fontSize: 16,
        lineHeight: 30,
        color: "#000000cc",
        marginTop: 10,
       
    },
    subContent: {
        display: "flex",
        flexDirection: "row",
        paddingRight:20
    },
    subTextContent: {
        fontSize: 16,
        // color: "#858585",
        lineHeight: 30,
        color: "#000000cc",
    },
    bulletin: {
        padding: 0,
        margin: 0,
    },
});
