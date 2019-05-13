import {
    Dimensions
} from 'react-native';

const { height, width } = Dimensions.get('window');

export const responsiveHeight = (h) => {
    return height * (h / 100);
};

export const responsiveWidth = (w) => {
    return width * (w / 100);
};

export const responsiveFontSize = (f) => {
    return Math.sqrt((height * height) + (width * width)) * (f / 100);
};

export const COLOR = {
    PRIMARY: '#4A7189',
    ACCENT: '#083D8B',
    PRIMARYDARK: '#083D8B'
}

export const STYLE = {
    statusBarHeight: responsiveHeight(10),
    headingfontStyle: {
        fontFamily: 'Raleway-Medium',
        fontSize: responsiveFontSize(3),
        fontWeight: 'normal'
    },
    subHeadingfontStyle: {
        fontFamily: 'Raleway-Medium',
        fontSize: responsiveFontSize(2.4),
        fontWeight: 'normal'
    },
    tableHeadingfontStyle: {
        fontFamily: 'Raleway-Medium',
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'normal'
    },
    bodyfontStyle: {
        fontFamily: 'Raleway-Medium',
        fontSize: responsiveFontSize(2),
        fontWeight: 'normal'
    },
    parafontStyle: {
        fontFamily: 'Raleway-Medium',
        fontSize: responsiveFontSize(2),
        fontWeight: 'normal'
    }
}

export const ASSET_STYLE = {
    circleBackGround: '#DADADA',
    doneColor: 'rgb(87, 194, 157)',
    containerBg: '#ccf5ff',
    underlayColor: 'rgb(235, 240, 255)',
    danger: '#FF0000'
}