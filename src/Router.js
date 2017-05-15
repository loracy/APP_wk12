import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen';
import SettingScreen from './screens/SettingScreen';
import SignupScreen from './screens/SignupScreen';

export const UserStack = StackNavigator({
    UserScreen: {
        screen: UserScreen,
        navigationOptions: {
            header: ({ navigate }) => ({
                
                title: 'User Info',
                right: (
                    <Icon
                        name='settings'
                        iconStyle={{ marginRight: 10 }}
                        onPress={() => navigate('SettingScreen')}
                        color='#ffffff'
                    />
                ),
                left: null,
                style: ({ backgroundColor: '#3387cd' }),
                tintColor: '#ffffff'
            })
        }
    },
    SettingScreen: {
        screen: SettingScreen,
        navigationOptions: {
            header: ({ navigate }) => ({
                title: 'Setting',
                left: (
                    <Icon
                        name='navigate-before'
                        iconStyle={{ marginLeft: 10 }}
                        onPress={() => navigate('UserScreen')}
                        color='#ffffff'
                    />
                ),
                style: ({ backgroundColor: '#3387cd' }),
                tintColor: '#ffffff'
            })
        }
    },
});
export const SignupStack = StackNavigator({
    SignupScreen: {
        screen: SignupScreen,
    },
    UserScreen: {
        screen: UserStack,    
    },
},
{
    headerMode: 'none',

}
);

export const LoginStack = StackNavigator({
    LoginScreen: {
        screen: LoginScreen,
    },
    UserStack: {
        screen: UserStack,
    },
    SignupStack: {
        screen: SignupStack,
    }
},
    {
        headerMode: 'none',
    }
);
