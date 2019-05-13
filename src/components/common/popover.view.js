import React, { Component } from 'react';

import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { ASSET_STYLE, STYLE } from '../../config/theme';

import { Popover, PopoverContainer } from '../../library/popover';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    popoverContainer: {
        backgroundColor: '#ffffff',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 5,
        marginRight: 2,
        elevation: 2
    }
});

class MenuPopoverView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPopoverVisible: false,
            popoverPlacement: 'bottom'
        }
    }

    togglePopover() {
        this.setState({ isPopoverVisible: !this.state.isPopoverVisible });
    }

    render() {
        const { menu } = this.props;
        const object = this;
        return (
            <Popover
                placement={this.state.popoverPlacement}
                arrowColor="#ffffff"
                arrowWidth={16}
                arrowHeight={8}
                isVisible={this.state.isPopoverVisible}
                component={() => (
                    <View style={styles.popoverContainer}>
                        {
                            menu.map((i, idx) => <TouchableOpacity onPress={() => {
                                i.action();
                                object.togglePopover(); }} style={{ padding: 10,
                            borderBottomColor: '#000000', borderBottomWidth: idx === (menu.length - 1) ? 0 : 0.3}}>
                                    <Text style={ [STYLE.bodyfontStyle, { color: '#000000'}]}>{i.title}</Text>
                                </TouchableOpacity>)
                        }
                    </View>
                )}>
                <TouchableOpacity onPress={this.togglePopover.bind(this)} style={{ marginRight: 5}}>
                    {this.props.image ? <Image style={{ width: 25, height: 25 }} source={this.props.trigger} /> :
                    <Text style={[STYLE.subHeadingfontStyle, { color: '#000000'}]}>{this.props.trigger}</Text>}
                </TouchableOpacity>
            </Popover>
        )
    }

}

export { MenuPopoverView, PopoverContainer };