import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux';
import { createinviteFriendLeagues } from '../redux/invitationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeagues } from '../redux/leaguesSlice';

const InviteFriendModal = ({ visible, onClose, emails, setEmails, league }) => {
    const dispatch = useDispatch();
    const handleSubmit = async () => {
        const userId = await AsyncStorage.getItem('userId');
        dispatch(createinviteFriendLeagues({ league, emails })).unwrap().then(() => { dispatch(getLeagues(userId)) });
        onClose();
    }
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Invite Friends</Text>

                    <TextInput
                        style={[styles.input, styles.membersInput]}
                        placeholder="Email"
                        value={emails}
                        onChangeText={setEmails}
                        multiline
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Invite</Text>
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
export default InviteFriendModal;

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
        // height: 150,
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
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        flex: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
});




