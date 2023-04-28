import { NavigationContainer } from "@react-navigation/native";
import BottomTabs from "./components/navigation/CustomBottomTabs";

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
