import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from 'react';
import Summary from '../pages/group/Summary';
import Equipment from '../pages/group/Equipment';
import Accounts from '../pages/group/Accounts';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomeBottomRoute = createBottomTabNavigator(
  {
    Summary: {
      screen: Summary,
      navigationOptions: {
        title: '首页',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="home" size={20} color={focused ? '#FF7A01' : '#666'} />
        ),
      },
    },
    Equipment: {
      screen: Equipment,
      navigationOptions: {
        title: '设备列表',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            name="list-alt"
            size={20}
            color={focused ? '#FF7A01' : '#666'}
          />
        ),
      },
    },
    Accounts: {
      screen: Accounts,
      navigationOptions: {
        title: '自动分账',
        tabBarIcon: ({tintColor, focused}) => (
          <Icon name="dollar" size={20} color={focused ? '#FF7A01' : '#666'} />
        ),
      },
    },
  },
  {
     // 初始路线名称
     initialRouteName:'Summary',
      // 标签栏位置
    tabBarPosition: 'bottom',
    // 标签栏选项
    tabBarOptions: {
      activeTintColor: '#FF7A01',
      inactiveTintColor: '#666',
    },
      // 懒加载
    lazy: false,
  },
 
);
HomeBottomRoute.navigationOptions = ({navigation}) => {
  //  关键这一行设置 header:null
  return {
    header: null,
  };
};

export default HomeBottomRoute;
