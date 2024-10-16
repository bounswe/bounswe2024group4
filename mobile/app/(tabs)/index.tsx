import { Text, SafeAreaView, StyleSheet } from "react-native";

export default function Index() {
  return (
    <SafeAreaView style={styles.screen}>
    <SafeAreaView style={styles.background}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1b1d21"
  },
  screen: {
    flex: 1,
    backgroundColor: "#1b1d21",
  }
});
