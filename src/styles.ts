import { StyleSheet, StatusBar, Platform } from 'react-native'
export const styles = StyleSheet.create({
  label: {
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic'
  },
  firstButton: {
    margin: 10
  },
  input: {
    borderBottomColor: '#999',
    paddingBottom: 2,
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    width: 200,
    height: 20
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    // alignContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // justifyContent: 'center',
  },
})
