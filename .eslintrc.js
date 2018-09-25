module.exports = {
    "extends": "airbnb",
    "env": {
        "react-native/react-native": true
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "ecmaFeatures": {
        "jsx": true
    },
    "rules": {
        "react-native/no-unused-styles": 1,
        "react-native/split-platform-components": 1,
        "react-native/no-inline-styles": 1,
        "react-native/no-color-literals": 1,
    }
};