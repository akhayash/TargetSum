import React from "react";
import { View, StyleSheet } from "react-native";
import Game from "./components/Game";

class App extends React.Component {
    render() {
        return <Game randomNumberCount={6} initialSeconds={10} />;
    }
}

export default App;
