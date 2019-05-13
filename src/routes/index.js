import Login from '../components/login';
import Register from '../components/register';
import Splash from '../components/splash';
import ForgotPassword from '../components/frgt-pwd';
import { StackNavigator } from 'react-navigation';
import DrawerStack from './drawer.stack';
import { NewTaskStack, ContractorTeamsFormStack, CompletedTaskStack }  from './task.stack';
import React from 'react';
import { Platform } from 'react-native';

const ApplicationStack = StackNavigator({
    Splash: {
        screen: Splash
    },
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    },
    Forgot: {
        screen: ForgotPassword
    },
    Home: {
        screen: DrawerStack
    },
    NewList: {
        screen: NewTaskStack
    },
    ContractorTeamsList: {
        screen: ContractorTeamsFormStack
    },
    CompletedList: {
        screen: CompletedTaskStack
    }
     },
    {
        initialRouteName: 'Splash',
        headerMode: 'none'//(Platform.OS === 'ios' ? 'screen' : 'none')
    });

export const NavigatorRoot = ApplicationStack;