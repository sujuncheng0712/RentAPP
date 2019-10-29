import React from 'react';
import {View, Text, TouchableOpacity, AsyncStorage,StyleSheet,ScrollView,ToastAndroid} from 'react-native';
import { Accordion, List } from '@ant-design/react-native';
const url = 'https://wx3.dochen.cn/api'
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth:'',
      isVendor:'',
      isMer01:'',
      isMer02:'',
      isMer03:'',
      username: '',
      balance: 0,             //余额
      equipmentSum:0,         //激活设备
      userSum:0,              //客户
      openKeys: [],           //控制下拉
      carrierSum:0,           //运营商总数
      agentSum:0,             //代理商总数
      dealerSum:0,            //经销商总数
      totalSum:{},            //充值次数,金额
      profitSum:0,            //总收益金额
      totalSumMonthly:[],     //每月充值次数,金额
      equipmentSumMonthly:[],  //每月激活设备
      activeSections: [0, 0],
      activeSections2: [0, 0],
      activeSections3: [0, 0],
    };
    this.onChange = activeSections => {
      this.setState({ activeSections });
    };
    this.onChange2 = activeSections2 => {
      this.setState({ activeSections2 });
    };
    this.onChange3 = activeSections3 => {
      this.setState({ activeSections3 });
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: '首页',
    };
  };

  // render创建之前
  componentWillMount() {
    // 验证/读取 登陆状态
    this._checkLoginState();
  }

  // 验证本地存储的资料是否有效
  _checkLoginState = async () => {
    let auth = await AsyncStorage.getItem('auth');
    auth = eval('(' + auth + ')');
    auth = auth[0];
    console.log(auth)
    if (auth !== null) {
      this.setState({
        auth: auth,
        isVendor:auth.type=== 1,
        isMer01:auth.type=== 2,
        isMer02:auth.type=== 3,
        isMer03:auth.type=== 4,
        username:auth.username,
      });
       //获取设备信息
       const mid = auth.mid ? `?mid=${auth.mid}` : '';
       this.getSummary(mid);
     

    } else {
      this.props.navigation.navigate('Login');
    }
  };

  //获得汇总
  getSummary(mid){
    const {isVendor, isMer01, isMer02} = this.state;
    if(isVendor){
      //获取运营商
      fetch(`${url}/summary/brand`).then(res=>{
        if(res.ok) {
          res.json().then(info=>{
            if(info.code === 10003){}
            else this.setState({carrierSum:info.date});
          });
        }
       
        else  ToastAndroid.show('获取运营商数据失败', ToastAndroid.SHORT);
      });
    }else{
      //获取总收益金额
      fetch(`${url}/summary/monery${mid}`).then(res=>{
        if(res.ok) {
          res.json().then(info=>{
            if(info.code === 10003){}
            else this.setState({profitSum:info.date});
          });
        }
        else  ToastAndroid.show('获取总收益数据失败', ToastAndroid.SHORT);
      });

      //获取余额
      fetch(`${url}/summary/balance${mid}`).then(res=>{
        if(res.ok) {
          res.json().then(info=>{
            if(info.code === 10003){}
            else this.setState({balance:info.date});
          });
        }
        else  ToastAndroid.show('获取余额数据失败', ToastAndroid.SHORT);
      });
    }

    if(isMer01 || isVendor){
      //获取代理商
      fetch(`${url}/summary/agaent${mid}`).then(res=>{
        if(res.ok) {
          res.json().then(info=>{
            if(info.code === 10003){}
            else this.setState({agentSum:info.date});
          });
        }
        else  ToastAndroid.show('获取代理商数据失败', ToastAndroid.SHORT);
      });
    }

    if(isMer02 || isMer01 || isVendor){
      //获取经销商
      fetch(`${url}/summary/merchant${mid}`).then(res=>{
        if(res.ok) {
          res.json().then(info=>{
            if(info.code === 10003){}
            else this.setState({dealerSum:info.date});
          });
        }
        else  ToastAndroid.show('获取经销商数据失败', ToastAndroid.SHORT);
      });
    }

    //获取激活设备数
    fetch(`${url}/summary/equipment${mid}`).then(res=>{
      if(res.ok) {
        res.json().then(info=>{
          if(info.code === 10003){}
          else this.setState({equipmentSum:info.date});
        });
      }  else  ToastAndroid.show('获取激活设备数据失败', ToastAndroid.SHORT);
    });

    //获取客户数
    fetch(`${url}/summary/user${mid}`).then(res=>{
      if(res.ok) {
        res.json().then(info=>{
          if(info.code === 10003){}
          else this.setState({userSum:info.date});
        });
      }
      else  ToastAndroid.show('获取客户数据失败', ToastAndroid.SHORT);
    });

    //获取充值次数、金额数量
    fetch(`${url}/summary/total${mid}`).then(res=>{
      if(res.ok) {
        res.json().then(info=>{
          if(info.code === 10003){}
          else this.setState({totalSum:info.date});
        });
      }
      else  ToastAndroid.show('获取充值次数、金额数据失败', ToastAndroid.SHORT);
    });

    //每月充值，金额
    fetch(`${url}/month/total${mid}`).then(res=>{
      if(res.ok) {
        res.json().then(info=>{
          if(info.code === 10003){}
          else this.setState({totalSumMonthly:info.date});
        });
      }
      else  ToastAndroid.show('获取每月充值次数、金额数据失败', ToastAndroid.SHORT);
    });

    //每月激活设备
    fetch(`${url}/month/equipment${mid}`).then(res=>{
      if(res.ok) {
        res.json().then(info=>{
          if(info.code === 10003){}
          else this.setState({equipmentSumMonthly:info.date});
        });
      }
      else  ToastAndroid.show('获取每月激活设备数据失败', ToastAndroid.SHORT);
    });
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  withdraw = async () => {
    await AsyncStorage.clear();
    this.props.navigation.push('Login');
  };
  
  render() {
    const { username, balance, equipmentSum, userSum, carrierSum, agentSum, dealerSum,
      totalSum, profitSum, totalSumMonthly, equipmentSumMonthly,
      isVendor, isMer01, isMer02, isMer03} = this.state;
    let total = [];
    let total1 = [];
    let equipments = [];

    if(totalSumMonthly.length>0){
      total = totalSumMonthly.map((item,i) =>
      <List.Item >
        <View style={{flexDirection:'row'}}>
         <Text style={styles.itemLeft}>{item.month}：</Text><Text style={styles.itemNum}>{item.times}</Text>
        </View>
     </List.Item> 
      );
      total1 = totalSumMonthly.map((item,i) =>
      <List.Item >
        <View style={{flexDirection:'row'}}>
          <Text style={styles.itemLeft}>{item.month}：</Text><Text style={styles.itemNum}>{item.total}</Text>
        </View>
     </List.Item> 
      );
    }

    if(equipmentSumMonthly.length>0){
      equipments = equipmentSumMonthly.map((item,i) =>
      <List.Item >
      <View style={{flexDirection:'row'}}>
        <Text style={styles.itemLeft}>{item.month}：</Text><Text style={styles.itemNum}>{item.count}</Text>
      </View>
   </List.Item> 
      );
    }
    
    return (
      <ScrollView style={{flex: 1,}}>
        <View style={styles.top}>
          <View style={styles.topOne}>
           <Text style={styles.topName}>用户名：{username}</Text>
           <TouchableOpacity style={{width:'50%',justifyContent:'flex-end'}} onPress={this.withdraw}>
            <Text style={{color:'white',textAlign:'right'}}>退出登录</Text>
           </TouchableOpacity>
          </View>
          <View style={styles.topTwo}>
            <View style={styles.topTwoItem}>
              <Text style={{color:'white'}}>{equipmentSum}</Text>
              <Text style={{color:'white'}}>激活设备</Text>
            </View>
            <View style={{...styles.topTwoItem,borderLeftWidth:1,borderLeftColor:'white'}}>
              <Text style={{color:'white'}}>{userSum}</Text>
              <Text style={{color:'white'}}>客户</Text>
            </View>
          </View>
        </View>
       
       <View>
       <Accordion
          onChange={this.onChange}
          activeSections={this.state.activeSections}
        >
          <Accordion.Panel header="商家数量">
            <List>
              {isVendor ? 
                <List.Item >
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.itemLeft}>运营商：</Text><Text style={styles.itemNum}>{carrierSum}</Text>
                  </View>
                </List.Item> :null
              }
             {(isVendor || isMer01) ? 
                <List.Item >
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.itemLeft}>代理商：</Text><Text style={styles.itemNum}>{agentSum}</Text>
                  </View>
                </List.Item> :null
              }
              {(isVendor || isMer01 || isMer02) ? 
                <List.Item >
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.itemLeft}>经销商：</Text><Text style={styles.itemNum}>{dealerSum}</Text>
                  </View>
                </List.Item> :null
              }
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="充值，金额">
          <List>
            <List.Item >
              <View style={{flexDirection:'row'}}>
                <Text style={styles.itemLeft}>充值次数：</Text><Text style={styles.itemNum}>{totalSum.times}</Text>
              </View>
            </List.Item> 
            <List.Item >
              <View style={{flexDirection:'row'}}>
                <Text style={styles.itemLeft}>金额数量：</Text><Text style={styles.itemNum}>{totalSum.total}</Text>
              </View>
            </List.Item> 
            {!isVendor ? 
              <View>
                <List.Item >
                  <View style={{flexDirection:'row'}}>
                   <Text style={styles.itemLeft}>总收益金额：</Text><Text style={styles.itemNum}>{profitSum}</Text>
                 </View>
              </List.Item> 
             </View>:null }
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="每月充值、金额">
            <List>
              <List.Item >
                <Accordion
                   onChange={this.onChange2}
                   activeSections={this.state.activeSections2}
                  >
                  <Accordion.Panel header="每月充值次数">
                    <List>
                     {total}
                    </List>
                  </Accordion.Panel>
                </Accordion>
              </List.Item>
              <List.Item >
                <Accordion
                   onChange={this.onChange3}
                   activeSections={this.state.activeSections3}
                  >
                  <Accordion.Panel header="每月金额数量">
                    <List>
                     {total1}
                    </List>
                  </Accordion.Panel>
                </Accordion>
              </List.Item>
           </List>
        </Accordion.Panel>
        <Accordion.Panel header="每月激活设备">
          <List>
            {equipments}
          </List>
        </Accordion.Panel>
        </Accordion>
       </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  button:{
    backgroundColor:'#FF7701',
  },
  top:{
    padding:10,
    width:'100%',
    backgroundColor:'#0D70FF'
  },
  topName:{
    color:'white',
    textAlign:'left',
    width:'50%',
  },
  topOne:{
    flexDirection:'row',
    borderBottomColor:'white',
    borderBottomWidth:1,
    paddingBottom:10,
    marginBottom:10,
  },
  topTwo:{
    flexDirection:'row',
    width:'100%',
  },
  topTwoItem:{
    width:'50%',
    alignItems:'center',
    justifyContent:'center',
  },
  itemNum:{
    color:'#0D70FF'
  },
  itemLeft:{
    paddingLeft:20,
  }
})