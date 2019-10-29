import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GroupHome from './src/pages/GroupHome';
import Login from './src/pages/users/Login';
import Summary from './src/pages/group/Summary';
import Equipment from './src/pages/group/Equipment';
import Accounts from './src/pages/group/Accounts';
const AppStack = createStackNavigator(
  {  
    GroupHome:GroupHome,
    Login:Login,
    Summary:Summary,
    Equipment:Equipment,
    Accounts:Accounts,
  }
)

export default createAppContainer(AppStack);
