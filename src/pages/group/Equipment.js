import React from 'react';
import {View, Text, ScrollView, AsyncStorage,ToastAndroid,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
import { Pagination } from '@ant-design/react-native';
const url = 'https://wx3.dochen.cn/api'
const locale = {
  prevText: '<',
  nextText: '>',
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: '',
      isVendor:'',
      isMer01:'',
      isMer02:'',
      isMer03:'',
      equipmentList:[],
      loading:true,
      visible: false,
      eInfo:{},
      newList:[],
      e:1,
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
      });
      //获取设备信息
      const mid = auth.mid ? `?mid=${auth.mid}` : '';
      let urlInfo = `${url}/equipments${mid}`;
      fetch(urlInfo).then(res=>{
        if(res.ok) {
          res.json().then(info=>{
            const equipmentList = [];
            if(info.code === 10003) {
              ToastAndroid.show('暂无数据', ToastAndroid.SHORT);
            }
            else{
              info.data.forEach(item=>{
                if(item.state===1) equipmentList.push(item);
              });
            }
            let newList = [];
            let page = Math.ceil(equipmentList.length/10);
            equipmentList.forEach((item,key)=>{
              if(key<10){
                newList.push(item);
              }
            })
            this.setState({equipmentList,loading:false,newList,page});
          });
        }
       // ToastAndroid.show('获取设备列表数据失败', ToastAndroid.SHORT);
      });
    } else {
      this.props.navigation.navigate('Login');
      
    }
  };

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  datasChange(e){
    const {equipmentList} = this.state;
    let newList = [];
  
    equipmentList.forEach((item,key)=>{
      if(key>=e*10-10 && key<e*10){
        newList.push(item);
      }
    })
    this.setState({newList,e})
  }

   //详情弹窗
   showModal = (uuid) => {
    //获取设备详情
    fetch(`${url}/equipments/${uuid}`).then(res=>{
      if(res.ok){
        res.json().then(info=>{
          console.log(info);
          if(info.code === 10003) 
          ToastAndroid.show('暂无数据', ToastAndroid.SHORT);
          else this.setState({eInfo:info.data[0],visible: true});
        });
      }
     // ToastAndroid.show('获取数据失败', ToastAndroid.SHORT);
    });
  };

  render() {
    const { equipmentList, loading, eInfo, isVendor, isMer01, isMer02, isMer03,newList,page,e,visible } = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <ScrollView style={{flex:1}}>
        <View style={styles.top}>
          <Text style={{...styles.topItem,width:'20%'}}>用户名</Text>
          <Text style={{...styles.topItem,width:'43%'}}>设备ID</Text>
          <Text style={{...styles.topItem,width:'22%'}}>剩余天数</Text>
          <Text style={{...styles.topItem,width:'15%'}}>详情</Text>
        </View>
        <FlatList
          data={newList}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={separator}
          renderItem={({item}) =>
            <View style={styles.top}>
              <Text style={{...styles.topItem,width:'20%'}}>{item.username}</Text>
              <Text style={{...styles.topItem,width:'43%'}}>{item.uuid}</Text>
              <Text style={{...styles.topItem,width:'22%'}}>{item.days}</Text>
              <View style={{...styles.topItem,width:'15%'}}>
                <TouchableOpacity 
                  onPress={()=>{this.showModal(item.uuid)}}
                  style={styles.topButton}>
                  <Text style={{color:'white',textAlign:'center'}}>详情</Text>
                </TouchableOpacity>
                
              </View>
          </View>
              }
        />
           {newList.length === 0 ?
         <Text style={{width:'100%',textAlign:'center'}}>NO DATA</Text>
         : <Text></Text>
        }
         <View style={styles.pagination}>
          <Pagination 
            total={page} 
            current={e} 
            locale={locale} 
            onChange={(e)=>{this.datasChange(e)}}/>
        </View>
        {visible ? 
           <View style={styles.scan}>
           <View style={styles.model}>
            <Text style={styles.modelTitle}>设备详情</Text>
            <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>设备ID:</Text>
              <Text style={styles.modelItem2}>{eInfo.uuid}</Text>
            </View>
            <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>型号:</Text>
              <Text style={styles.modelItem2}>{eInfo.model}</Text>
            </View>
            <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>在线状态:</Text>
              <Text style={styles.modelItem2}>{eInfo.online_at && !eInfo.offline_at ? '在线':'离线'}</Text>
            </View>
            <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>剩余天数:</Text>
              <Text style={styles.modelItem2}>{eInfo.days}</Text>
            </View>
            <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>用户名:</Text>
              <Text style={styles.modelItem2}>{eInfo.username}</Text>
            </View>
            {(isVendor || isMer01 || isMer02)  ?
              <View style={styles.modelItemTotal}>
               <Text style={styles.modelItem}>经销商:</Text>
                <Text style={styles.modelItem2}>{eInfo.merchant ? eInfo.merchant.m3 ? eInfo.merchant.m3.shortname || eInfo.merchant.m3.organization  : '--' : '--'}</Text>
              </View>:
             <Text></Text>
           }
            
            {(isVendor || isMer01)  ?
              <View style={styles.modelItemTotal}>
               <Text style={styles.modelItem}>代理商:</Text>
                <Text style={styles.modelItem2}>{eInfo.merchant ? eInfo.merchant.m2 ? eInfo.merchant.m2.shortname || eInfo.merchant.m2.organization  : '--' : '--'}</Text>
              </View>:
             <Text></Text>
           }

          {(isVendor)  ?
              <View style={styles.modelItemTotal}>
               <Text style={styles.modelItem}>运营商:</Text>
                <Text style={styles.modelItem2}>{eInfo.merchant ? eInfo.merchant.m1 ? eInfo.merchant.m1.shortname || eInfo.merchant.m1.organization  : '--' : '--'}</Text>
              </View>:
             <Text></Text>
           }  
          <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>机器状态:</Text>
              <Text style={styles.modelItem2}>{eInfo.shutdown===0 ? '关机':'开机'}</Text>
            </View>
            <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>绑定时间:</Text>
              <Text style={styles.modelItem2}>{eInfo.activation_at}</Text>
            </View>
            <View style={styles.modelItemTotal}>
              <Text style={styles.modelItem}>安装地址:</Text>
              <Text style={styles.modelItem2}>{eInfo.remark}</Text>
            </View>
            <View style={styles.modelBottom}>
              <View style={styles.modelBottomRight}>
              <TouchableOpacity 
                  onPress={()=>{this.setState({visible:false})}}
                  style={{...styles.modelButton,backgroundColor:'#fff',borderWidth:1,borderColor:'grey'}}>
                  <Text style={{color:'black',textAlign:'center'}}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={()=>{this.setState({visible:false})}}
                   style={styles.modelButton}>
                  <Text style={{color:'white',textAlign:'center'}}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
           </View>
           
         </View> :
         <Text></Text> 
      }
       
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  top:{
    flexDirection:'row',
    backgroundColor:'#F0EEEF',
    borderBottomColor:'#666',
    borderBottomWidth:0.5,
  },
  topItem:{
    textAlign:'center',
    padding:10,
  },
  pagination:{
    width:'50%',
    marginLeft:'50%',
  },
  topButton:{
    backgroundColor:'#0D70FF',
    borderColor:'#0D70FF',
    borderWidth:1,
    borderRadius:5,
  },
  scan:{
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  model:{
    width:'90%',
    borderColor:'red',
    borderWidth:1,
    backgroundColor:'white',
  },
  modelTitle:{
    textAlign:'left',
    paddingLeft:20,
    paddingTop:10,
    paddingBottom:10,
    marginBottom:10,
    borderBottomColor:'grey',
    borderBottomWidth:0.5,

  },
  modelBottom:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    borderTopColor:'grey',
    borderTopWidth:0.5,
    marginTop:15,
  },
  modelBottomRight:{
    width:'50%',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    paddingBottom:5,
    paddingTop:5,
    paddingRight:5,
  },
  modelButton:{
    paddingTop:5,
    paddingBottom:5,
    paddingRight:15,
    paddingLeft:15,
    backgroundColor:'#0D70FF',
    borderRadius:5,
    marginLeft:5,
  },
  modelItem:{
    textAlign:'left',
    paddingLeft:20,

    width:'50%',
  },
  modelItem2:{
    paddingRight:20,
    textAlign:'right',
    width:'50%',
  },
  modelItemTotal:{
    width:'100%',
    justifyContent:'space-between',
    flexDirection:'row'
  }
})
