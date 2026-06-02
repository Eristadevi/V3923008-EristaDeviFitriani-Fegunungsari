import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F1",
  },

  headerImage: {
    width: "100%",
    height: 230,
  },

  headerContent: {
    backgroundColor: "#2E7D32",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    fontSize: 14,
    color: "#E8F5E9",
    marginTop: 5,
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
  },

  cardImage: {
    width: "100%",
    height: 180,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 15,
    color: "#2E7D32",
  },

  cardText: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 8,
    lineHeight: 20,
  },
});

export default styles;