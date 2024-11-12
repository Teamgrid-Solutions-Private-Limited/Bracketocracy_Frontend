import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loader = ({size}) => {
  if(size){
    return (
      <ActivityIndicator size={size} color="#ebb04b" style={styles.container}/>
    )
  }
  return (
    <ActivityIndicator size={30} color="#ebb04b" style={styles.container}/>
  )
}

export default Loader;

const styles = StyleSheet.create({
})