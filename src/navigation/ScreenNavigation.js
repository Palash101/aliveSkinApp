import {createStackNavigator} from '@react-navigation/stack';

import DrawerNavigation from './DrawerNavigation';
import Questionaries from '../screens/Questionaries';

const ScreenNavigationStack = ({navigation}) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
     
      
       <Stack.Screen
        name={'Drawer'}
        component={DrawerNavigation}
        options={{
          headerShown: false,
          cardStyle: {backgroundColor: '#ffffff'},
        }}
      />
    </Stack.Navigator>
  );
};

export default ScreenNavigationStack;
