import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditProfile, updateEditProfile, deleteProfile } from '../redux/editProfileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from '../header';
import Footer from '../footer';
const InputField = ({ placeholder, value, onChangeText }) => (
    <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#414141"
        value={value}
        onChangeText={onChangeText}
    />
);
 
const ActionButton = ({ title, onPress, style }) => (
    <TouchableOpacity style={[styles.actionButton, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);
 
const Index = () => {
    const navigation = useNavigation()
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePhoto, setprofilePhoto] = useState(null);
    const dispatch = useDispatch();
    const { editProfile, status } = useSelector((state) => state.editProfile);
 
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                    dispatch(fetchEditProfile(storedUserId));
                }
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };
 
        fetchUserData();
    }, [dispatch]);
    const handleDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete your profile? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        dispatch(deleteProfile(userId))
                            .unwrap()
                            .then(async () => {
                                await AsyncStorage.clear();  // Clear AsyncStorage
                                Alert.alert("Profile deleted successfully!");
                                navigation.navigate('sign-in');  // Navigate to Sign-In page
                            })
                            .catch((error) => {
                                Alert.alert("Failed to delete profile", error.message);
                            });
                    },
                },
            ],
            { cancelable: false }
        );
    };
 
    useEffect(() => {
        if (editProfile) {
            setUserName(editProfile.userName||'');
            setFirstName(editProfile.firstName||'');
            setLastName(editProfile.lastName||'');
            setEmail(editProfile.email||'');
            // setprofilePhoto(editProfile.profilePhoto||null);
        }
    }, [editProfile]);
 
 
    const chooseImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
            Alert.alert(
                "Select Image Source",
                "Choose an image from your gallery or take a new one with your camera.",
                [
                    {
                        text: "Camera",
                        onPress: openCamera
                    },
                    {
                        text: "Gallery",
                        onPress: openImagePicker
                    },
                    {
                        text: "Cancel",
                        style: "cancel"
                    }
                ]
            );
        } else {
            Alert.alert(
                "Permission denied",
                "You've refused to allow this app to access your photos. Please enable permissions from the settings."
            );
        }
    };
 
    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });
 
            if (!result.canceled) {
                setprofilePhoto(result.assets[0].uri);
            }
        } else {
            Alert.alert(
                "Permission denied",
                "You've refused to allow this app to access your camera. Please enable permissions from the settings."
            );
        }
    };
 
    const openImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
 
        if (!result.canceled) {
            setprofilePhoto(result.assets[0].uri);
        }
    };
    const handleUpdate = async () => {
        let userData = {
            id: userId,
            userName,
            firstName,
            lastName,
            email,
        };
   
        // Ensure profilePhoto is available and contains all necessary data
        if (profilePhoto && profilePhoto.uri) {
            userData.profilePhoto = {
                uri: profilePhoto.uri,
                name: profilePhoto.fileName || profilePhoto.uri.split('/').pop(),  // Fallback if fileName is not available
                type: profilePhoto.mimeType || `image/${profilePhoto.uri.split('.').pop()}`,
            };
        }
   
        dispatch(updateEditProfile(userData))
            .unwrap()
            .then(() => {
                Alert.alert("Profile updated successfully!");
                dispatch(fetchEditProfile(userId));
            })
            .catch((error) => {
                Alert.alert("Failed to update profile", error.message);
            });
    };
   
    // UseEffect to ensure profilePhoto is fully set before triggering the update
   
   
 
 
 
 
    if (status === "loading") return <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>;
 
    return (
        <View style={styles.container}>
            <Header editProfile={editProfile} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.main}>
                    <View style={styles.header}><Text style={styles.headerText}>Edit Profile</Text></View>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.contentWrapperHeaderText}>Personal Information</Text>
                        <InputField placeholder="User Name" value={userName} onChangeText={setUserName} />
                        <InputField placeholder="First Name" value={firstName} onChangeText={setFirstName} />
                        <InputField placeholder="Last Name" value={lastName} onChangeText={setLastName} />
                        <InputField placeholder="Email" value={email} onChangeText={setEmail} />
                        <View style={styles.profilePhotoRow}>
                            <Text>Profile Picture</Text>
                            <TouchableOpacity style={styles.chooseButton} onPress={chooseImage}>
                                <Text>Choose File</Text>
                            </TouchableOpacity>
                            {profilePhoto ? (
                                <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
                            ) : (
                                <Text>No file chosen</Text>
                            )}
                        </View>
                        <View style={styles.buttonWrapper}><ActionButton title="Update" onPress={handleUpdate} /></View>
                    </View>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.contentWrapperHeaderText}>Delete account</Text>
                        <Text style={styles.deleteWarning}>Deleting your account will remove all your information</Text>
                        <View style={styles.buttonWrapper}><ActionButton title="Delete" onPress={handleDelete} style={styles.deleteButton} /></View>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </View>
    );
};
 
export default Index;
 
const styles = StyleSheet.create({
    container: {
       
        flex: 1,
        backgroundColor: "#f2f1ed",
    },
    scrollContent: {
        flexGrow: 1,
        marginTop: 10,
    },
    main: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginVertical: 15,
        width: "85%",
        backgroundColor: "#454134",
        padding: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    headerText: {
        fontSize: 18,
        textAlign: "center",
        color: "#d0d0ce",
        textTransform: "uppercase"
    },
    contentWrapper: {
        width: "85%",
        textAlign: "left",
        backgroundColor: "#ffffff",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        marginBottom: 20
    },
    contentWrapperHeaderText: {
        color: "#73726a",
        textTransform: "uppercase"
    },
    input: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#535353',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        fontWeight: "bold"
    },
    profilePhotoRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
        alignItems: "center"
    },
    chooseButton: {
        borderWidth: 1,
        borderColor: "#a4a4a4",
        paddingVertical: 2,
        paddingHorizontal: 3,
        borderRadius: 3
    },
    buttonWrapper: {
        marginTop: 10,
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
    },
    actionButton: {
        backgroundColor: "#ebb04b",
        paddingHorizontal: 35,
        paddingVertical: 10,
        textTransform: "uppercase",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        marginTop: 10
    },
    deleteButton: {
        backgroundColor: "#ff4d4d",
    },
    buttonText: {
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "white",
    },
    deleteWarning: {
        width: "70%",
        marginTop: 10,
        color: "#94938e",
        fontSize: 12
    },
    profilePhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
    },
});