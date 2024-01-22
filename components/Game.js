import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import RandomNumber from "./RandomNumber";
import shuffle from "lodash.shuffle";

class Game extends React.Component {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
    };

    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds,
    };

    gameStatus = "PLAYING";

    // random numbers
    randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(
        () => 1 + Math.floor(10 * Math.random()),
    );

    // taret number is sum of random numbers
    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0);
    shuffledRandomNumbers = shuffle(this.randomNumbers);

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState(
                (prevState) => {
                    return { remainingSeconds: prevState.remainingSeconds - 1 };
                },
                () => {
                    if (this.state.remainingSeconds === 0) {
                        clearInterval(this.intervalId);
                    }
                },
            );
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    };

    selectNumber = (numberIndex) => {
        this.setState((prevState) => {
            return {
                selectedIds: [...prevState.selectedIds, numberIndex],
            };
        });
    };

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (
            nextState.selectedIds !== this.state.selectedIds ||
            nextState.remainingSeconds === 0
        ) {
            this.gameStatus = this.calcGameStatus(nextState);
            if (this.gameStatus !== "PLAYING") {
                clearInterval(this.intervalId);
            }
        }
    }

    calcGameStatus = (nextState) => {
        const sumSelected = nextState.selectedIds.reduce(
            (acc, curr) => acc + this.shuffledRandomNumbers[curr],
            0,
        );
        console.log(sumSelected);

        if (nextState.remainingSeconds === 0) {
            return "LOST";
        }
        if (sumSelected < this.target) {
            return "PLAYING";
        }
        if (sumSelected === this.target) {
            return "WON";
        }
        if (sumSelected > this.target) {
            return "LOST";
        }
    };

    render() {
        // const gameStatus = this.gameStatus();
        const gameStatus = this.gameStatus;
        return (
            <View style={styles.container}>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
                    {this.target}
                </Text>
                <View style={styles.randomContainer}>
                    {this.shuffledRandomNumbers.map((randomNumber, index) => (
                        <RandomNumber
                            key={index}
                            id={index}
                            number={randomNumber}
                            isDisabled={
                                this.isNumberSelected(index) ||
                                gameStatus !== "PLAYING"
                            }
                            onPress={this.selectNumber}
                        />
                    ))}
                </View>
                <Text>{gameStatus}</Text>
                <Text>{this.state.remainingSeconds}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ddd",
        flex: 1,
    },

    target: {
        fontSize: 50,
        backgroundColor: "#bbb",
        margin: 50,
        textAlign: "center",
    },
    randomContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    SATUS_PLAYING: {
        backgroundColor: "#bbb",
    },
    STATUS_WON: {
        backgroundColor: "green",
    },
    STATUS_LOST: {
        backgroundColor: "red",
    },
});

export default Game;
