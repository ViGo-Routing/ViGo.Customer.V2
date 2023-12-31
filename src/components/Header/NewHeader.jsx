import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../../assets/theme";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
const NewHeader = ({ title, subtitle, onBack }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack}>
                <Text style={styles.backButton}>
                    <ArrowLeftIcon size={30} color="white" />
                </Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={null}>
                    {subtitle}
                </Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        height: 80,
        backgroundColor: themeColors.primary,
    },

    titleContainer: {
        paddingRight: 10,
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 25,
        fontWeight: "600",
        color: "white",
        paddingTop: 10,
    },
    subtitle: {
        fontSize: 14,
        paddingTop: 10,
        color: themeColors.linear,
    },

});

export default memo(NewHeader);