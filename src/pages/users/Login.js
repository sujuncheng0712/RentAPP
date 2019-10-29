import React from 'react';
import {
  AsyncStorage,
  TextInput,
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  ToastAndroid,TouchableOpacity
} from 'react-native';
const url = 'https://wx3.dochen.cn/api'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  componentDidMount() {
    // try {
    //   wechat.registerApp('wxed79edc328ec284a');
    // } catch (e) {
    //   console.error(e);
    // }
  }

  render() {
    const Login = () => {
      const {username, password} = this.state;
      let urlInfo = `${url}/auth`;
      fetch(urlInfo, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }).then(res => {
        res.json().then(info => {
          if (info.status) {
            _storeData(info.data,1);
          } else {
            ToastAndroid.show('登录失败，请检查用户名和密码', ToastAndroid.SHORT);
          }
        });
      });
    };

    const GroupLogin = () => {
      const {username, password} = this.state;
      let urlInfo = `${url}/auth`;
      fetch(urlInfo, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
          auth_type: 'wx',
          type:'merchants',
        }),
      }).then(res => {
        res.json().then(info => {
          console.log(info);
          if (info.status) {
            _storeData(info.data,2);
          } else {
            ToastAndroid.show('登录失败，请检查用户名和密码', ToastAndroid.SHORT);
          }
        });
      });
    };

    

    // 本地存储
    const _storeData = async (data,state) => {
      //data.token = Date.parse(new Date());
      console.log(data);
      try {
        await AsyncStorage.setItem('auth', JSON.stringify(data), () => {
          // 存储成功后跳转
          if(state ===2){
            this.props.navigation.push('GroupHome');
          }else if(state ===1){
            this.props.navigation.push('White');
          }
            
        });
      } catch (error) {
        // Error saving data
      }
    };
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>净水共享平台</Text>
        <View style={styles.item}>
          <Text >账号：</Text>
          <TextInput
            style={styles.input_text}
            placeholder={'账号'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={text => {text=text.trim();this.setState({username: text})}}
          />
        </View>
        <View style={styles.item}>
         <Text >密码：</Text>
          <TextInput
            style={styles.input_text}
            placeholder={'密码'}
            autoCapitalize={'none'}
            autoCorrect={false}
            secureTextEntry={true}
            maxLength={16}
            onChangeText={text => {text=text.trim();this.setState({password: text})}}
          />
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10,marginTop:10}}>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Login();
            }}>
           <Text style={styles.buttonFont}>个人登录</Text> 
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              GroupLogin();
            }}>
            <Text style={styles.buttonFont}>商家登录</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.register}>
        <TouchableOpacity
            style={styles.registerButton}
            onPress={() => {
              this.props.navigation.navigate('Register')
            }}>
            <Text style={{color:'grey'}}>用户注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// 获得屏幕宽度高度
const swidth = Dimensions.get('window').width;
const sheight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    width: swidth * 0.7,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input_icon: {
    width: 50 * 0.4,
    height: 49,
  },
  input_text: {
    width: swidth * 0.7 - 50 * 0.4 - 10,
    height: 35,
    paddingVertical: 0,
    borderColor:'#666',
    borderWidth:0.5,
    borderRadius:5,
  },
  forget: {
    marginTop: 36,
    flex: 1,
    alignItems: 'flex-end',
  },
  forget_text: {
    color: '#517eff',
  },
  button: {
    margin:5,
    backgroundColor:'#FF7701',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:20,
    paddingRight:20,
    borderColor:'#FF7701',
    borderWidth:1,
    borderRadius:5,
  },
  buttonFont:{
    color:'white',
  },
  come_back: {
    position: 'absolute',
    left: 22,
    top: 15,
  },
  title:{
    fontSize:25,
    marginBottom:40,
    color:'#FF7701'
  },
  item:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:5,
  },
  register:{
    width:'100%',
    padding:5,
    marginTop:10,
    justifyContent:'center',
    alignItems:'center',
  },
  registerButton:{
    justifyContent:'center',
    alignItems:'center',
    padding:5,
  }
});
