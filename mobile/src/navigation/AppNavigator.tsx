import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import UpcomingAuctionsScreen from '../screens/auctions/UpcomingAuctions';
import AuctionDetailsScreen from '../screens/auctions/AuctionDetailsScreen';
import PlayerDetailsScreen from '../screens/players/PlayerDetailsScreen';
import JoinLeagueScreen from '../screens/leagues/JoinLeagueScreen';
import LeagueStandingsScreen from '../screens/leagues/LeagueStandingsScreen';
import MyTeamScreen from '../screens/teams/MyTeamScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SupportScreen from '../screens/support/SupportScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const AuctionStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UpcomingAuctions" component={UpcomingAuctionsScreen} />
    <Stack.Screen name="AuctionDetails" component={AuctionDetailsScreen} />
    <Stack.Screen name="PlayerDetails" component={PlayerDetailsScreen} />
  </Stack.Navigator>
);

const LeagueStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JoinLeague" component={JoinLeagueScreen} />
    <Stack.Screen name="LeagueStandings" component={LeagueStandingsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'League') {
          iconName = focused ? 'trophy' : 'trophy-outline';
        } else if (route.name === 'My Team') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#000' },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={AuctionStack} />
    <Tab.Screen name="League" component={LeagueStack} />
    <Tab.Screen name="My Team" component={MyTeamScreen} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Set to true to see the main app

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
