import {
  StyleSheet,
  View,
  Text,
  Linking,
  Pressable,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { AntDesign } from '@expo/vector-icons'; 

function MemoItem(props) {
  const imagesAndFunctions = [
    {
      icon: "google",
      function: () => {
        Linking.openURL("https://www.google.com/search?q=" + props.text);
      },
    },
    {
      icon: "youtube",
      function: () => {
        Linking.openURL(
          "https://www.youtube.com/results?search_query=" + props.text
        );
      },
    },
    {
      icon: "copy1",
      function: async () => {
        await Clipboard.setStringAsync(props.text);
      },
    },
    {
      icon: "checkcircleo",
      function: () => {
        props.onDeleteItem(props.id);
      },
    },
  ];

  return (
    <View style={styles.memo}>
      <Text style={styles.memoText}>{props.text}</Text>
      <View style={styles.imageGroup}>
        {imagesAndFunctions.map((item, index) => {
          return (
            <View key={index} style={styles.btnBox}>
              <Pressable
                onPress={item.function}
                style={({ pressed }) => pressed && styles.pressedImage}
              >
                <AntDesign name={item.icon} size={24} color="black" style={styles.icon}/>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default MemoItem;

const styles = StyleSheet.create({
  memo: {
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#f2f2f2",
  },
  memoText: {
    padding: 15,
    fontSize: 16,
  },
  imageGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  btnBox: {
    flex: 1,
    borderTopWidth: 1,
  },
  icon: {
    width: 24,
    marginVertical: 6,
    alignSelf: "center",
  },
  pressedImage: {
    opacity: 0.5,
  },
});
