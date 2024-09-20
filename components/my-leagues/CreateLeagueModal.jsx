import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { createUpdateLeagues, getLeagues } from '../redux/leaguesSlice';

const CreateLeagueModal = ({ visible, onClose, currentLeague, title, setEmails, emails, allowInvitation, setAllowInvitation, setTitle }) => {
    const dispatch = useDispatch();
    const setFormValues = (league) => {
        setTitle(league?.title || '');
        setEmails(league?.emails.join(',') || '');
        setAllowInvitation(league?.allowInvitation || false);
    };

    useEffect(() => {
        if (currentLeague) {
            setFormValues(currentLeague);
        }
    }, [currentLeague]);

    const handleSubmit = async (actionType) => {
        const userId = await AsyncStorage.getItem('userId');
        const cleanedTitle = title.trim();
    
        // Split emails, remove whitespace, filter empty strings, and remove duplicates
        const emailArray = [...new Set(emails
            .split(',')
            .map(email => email.trim())
            .filter(email => email !== '')
        )];
    
        if (!cleanedTitle) {
            alert('Title cannot be empty');
            return;
        }
    
        const payload = {
            title: cleanedTitle,
            emails: emailArray,
            allowInvitation,
            userId,
            action: actionType
        };
    
        if (currentLeague && actionType === 'update') {
            payload.leagueId = currentLeague._id;
        }
    
        dispatch(createUpdateLeagues(payload))
            .unwrap()
            .then(() => {
                dispatch(getLeagues(userId));
            });
    
        onClose();
    };
    


    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{currentLeague ? "Update League" : "Create New League"}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.input, styles.membersInput]}
                        placeholder="To add more than one email address, separate them with a comma"
                        value={emails}
                        onChangeText={setEmails}
                        multiline
                    />
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={allowInvitation}
                            onValueChange={setAllowInvitation}
                        />
                        <Text style={styles.checkboxLabel}>
                            Allow members to invite friends?
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(currentLeague ? "update" : "create")}>
                            <Text style={styles.buttonText}>{currentLeague ? "Update" : "Submit"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#999',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    membersInput: {
        height: 150,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#ebb04b',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
        marginRight: 10
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1
    },
    buttonText: {
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "white",
        fontFamily: "nova",
        textAlign: "center",
    },
});

export default CreateLeagueModal;
