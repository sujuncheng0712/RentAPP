import React from 'react';
import {View, Text, ScrollView, AsyncStorage,TouchableOpacity,StyleSheet,FlatList} from 'react-native';
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
      auth:'',
      isVendor:'',
      isMer01:'',
      isMer02:'',
      isMer03:'',
      thisMonth:[],   //本月收益列表
      lastMonth:[],   //历史收益列表
      loading:true,
      visible: false,
      tabsKey:1,
      acInfo:[],      //设备详情列表
      page1:1,
      page2:1,
      e1:1,
      e2:1,
      newThisMontht:[],
      newLastMonth:[],
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
    const mid = auth.mid ? `?mid=${auth.mid}` : '';
    if (auth !== null) {
      this.setState({
        auth,
        mid,
        isVendor:auth.type=== 1,
        isMer01:auth.type=== 2,
        isMer02:auth.type=== 3,
        isMer03:auth.type=== 4,
      });
      this.getAccountsList(mid);

    } else {
      this.props.navigation.navigate('Login');
    }
  };
 //获取收益列表
  getAccountsList(mid){
    //获取收益列表
    fetch(`${url}/earnings${mid}`).then(res=>{
      if(res.ok) {
        res.json().then(info=>{
          console.log(info);
          if(info.code === 10003){
            ToastAndroid.show('暂无数据', ToastAndroid.SHORT);
            this.setState({thisMonth:[],lastMonth:[],loading:false});
          }else{
            //获得一个数组年月日 下标012
            //const nowDate = new Date().toLocaleDateString().split('/');
            const thisMonth = [];
            const lastMonth = [];
            info.data.forEach(item=>{
              //获得每个item年月日 下标012
              //let itemDate = new Date(item.created_at).toLocaleDateString().split('/');
              //如果是本年本月
              if(item.state===0) {
                thisMonth.push(item);
              }else{
                lastMonth.push(item);
              }
            });
            let newThisMontht = [];
            let page1 = Math.ceil(thisMonth.length/10);
            thisMonth.forEach((item,key)=>{
              if(key<10){
                newThisMontht.push(item);
              }
            })

            let newLastMonth = [];
            let page2 = Math.ceil(lastMonth.length/10);
            lastMonth.forEach((item,key)=>{
              if(key<10){
                newLastMonth.push(item);
              }
            })
            this.setState({thisMonth,newThisMontht, page1,page2,lastMonth,newLastMonth, loading:false});
          }
        });
      }
      //else message.error('获取收益列表数据失败');
    });
  }

  componentDidMount() {
    //wechat.registerApp('wxed79edc328ec284a');
  }

  newThisMonthtChange(e){
    const {thisMonth} = this.state;
    let newList = [];
  
    thisMonth.forEach((item,key)=>{
      if(key>=e*10-10 && key<e*10){
        newList.push(item);
      }
    })
    this.setState({newThisMontht:newList,e1:e})
  }

  newLastMonthtChange(e){
    const {lastMonth} = this.state;
    let newList = [];
  
    lastMonth.forEach((item,key)=>{
      if(key>=e*10-10 && key<e*10){
        newList.push(item);
      }
    })
    this.setState({newLastMonth:newList,e2:e})
  }

  render() {
    const { thisMonth, lastMonth, loading, isVendor, isMer01, isMer02, isMer03, tabsKey, acInfo,page1,page2,e1,e2,newLastMonth,newThisMontht } = this.state;
    const separator = () =>  {
      return (
        <View style={styles.separator}></View>
      )
    };
    return (
      <ScrollView style={{flex:1,}}>
         <View style={styles.top}>
           <TouchableOpacity 
            style={styles.topButton}
            onPress={()=>{this.setState({tabsKey:1})}}>
             <Text style={{...styles.topItem,color:tabsKey === 1 ? '#0D70FF' : '#666',borderBottomWidth:tabsKey === 1 ? 1 : 0,borderBottomColor:tabsKey === 1 ? '#0D70FF' : '#666'}}>未结算收益</Text>
           </TouchableOpacity>
            <TouchableOpacity
              style={styles.topButton}
              onPress={()=>{this.setState({tabsKey:2})}}>
              <Text style={{...styles.topItem,color:tabsKey === 2 ? '#0D70FF' : '#666',borderBottomWidth:tabsKey === 2 ? 1 : 0,borderBottomColor:tabsKey === 2 ? '#0D70FF' : '#666'}}>已结算收益</Text>
            </TouchableOpacity>
         </View >

          <View style={{...styles.title,backgroundColor:'#DDDDDD'}}>
            <Text style={{...styles.titleItem,width:'35%'}}>设备ID</Text>
            <Text style={{...styles.titleItem,width:'15%'}}>收益</Text>
            <Text style={{...styles.titleItem,width:'25%'}}>状态</Text>
            <Text style={{...styles.titleItem,width:'25%'}}>详情</Text>
          </View>

          {tabsKey === 1 ?
          <View>
            <FlatList
              data={newThisMontht}
              keyExtractor={(item) => String(item.id)}
              ItemSeparatorComponent={separator}
              renderItem={({item}) =>
                <View style={styles.title }>
                  <Text style={{...styles.titleItem,width:'35%'}}>{item.eid}</Text>
                  <Text style={{...styles.titleItem,width:'15%'}}>{Math.floor( (isVendor ? item.total-item.m1earning-item.m2earning-item.m3earning :
                    isMer01 ? item.m1earning :
                    isMer02 ? item.m2earning :
                    isMer03 ? item.m3earning : '')*1000)/1000}</Text>
                  <Text style={{...styles.titleItem,width:'25%',color:item.state ===0 ? 'red' :'green'}}>{item.state ===0 ? '待结算' :'已结算'}</Text>
                  <View style={{...styles.titleItem,width:'25%'}}>
                    <TouchableOpacity 
                      //onPress={()=>{this.showModal(item.uuid)}}
                      style={styles.itemButton}>
                      <Text style={{color:'white',textAlign:'center'}}>详情</Text>
                    </TouchableOpacity>
                    
                  </View>
              </View>
                }
          />
            <View style={styles.pagination}>
              <Pagination 
                total={page1} 
                current={e1} 
                locale={locale} 
                onChange={(e)=>{this.newThisMonthtChange(e)}}/>
          </View>
        </View> :
        <View>
           <FlatList
            data={newLastMonth}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={separator}
            renderItem={({item}) =>
              <View style={styles.title }>
                <Text style={{...styles.titleItem,width:'35%'}}>{item.eid}</Text>
                <Text style={{...styles.titleItem,width:'15%'}}>{Math.floor( (isVendor ? item.total-item.m1earning-item.m2earning-item.m3earning :
                  isMer01 ? item.m1earning :
                  isMer02 ? item.m2earning :
                  isMer03 ? item.m3earning : '')*1000)/1000}</Text>
                <Text style={{...styles.titleItem,width:'25%',color:item.state ===0 ? 'red' :'green'}}>{item.state ===0 ? '待结算' :'已结算'}</Text>
                <View style={{...styles.titleItem,width:'25%'}}>
                  <TouchableOpacity 
                    //onPress={()=>{this.showModal(item.uuid)}}
                    style={styles.itemButton}>
                    <Text style={{color:'white',textAlign:'center'}}>详情</Text>
                  </TouchableOpacity>
                  
                </View>
            </View>
              }
         />
         <View style={styles.pagination}>
           <Pagination 
             total={page2} 
             current={e2} 
             locale={locale} 
             onChange={(e)=>{this.newLastMonthtChange(e)}}/>
          </View>
       </View>
        }
         
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  top:{
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width:'100%',
  },
    topItem:{
      width:'50%',
      textAlign:'center',
      padding:10,
  
    },
    topButton:{
      width:'50%',
      justifyContent:'center',
      alignItems:'center',
      borderBottomWidth:1,
      borderBottomColor:'#666',
    },
    title:{
      flexDirection:'row',
      paddingTop:10,
      paddingBottom:10,
      borderBottomColor:'#666',
      borderBottomWidth:0.5,
      marginTop:10,
    },
    titleItem:{
      textAlign:'center',
      justifyContent:'center',
      alignItems:'center',
    },
    itemButton:{
      backgroundColor:'#0D70FF',
      borderColor:'#0D70FF',
      borderWidth:1,
      borderRadius:5,
      paddingTop:2,
      paddingBottom:2,
      width:'80%',
    },
    pagination:{
      width:'50%',
      marginLeft:'50%',
    },
})