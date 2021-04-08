import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StacK } from './src/routers/boot_router'


/****************************************
 * Render
 *****************************************/
function App() {
  return (
    <NavigationContainer>
      <StacK />
    </NavigationContainer>
  );
}

export default App;