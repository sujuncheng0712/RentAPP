import React from 'react';
import {View, Text, AsyncStorage} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      uuid: '',
      name: '',
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
       headerTitle:'白色',
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
   
  }

 

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>11</Text>
      </View>
    );
  }
}
