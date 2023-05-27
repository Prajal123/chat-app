import './App.css';
import {Route} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';


function App() {
   
  return (
    <div className="App">
      
      <Route path="/chat" component={ChatPage} exact></Route>
      <Route path="/" component={HomePage} exact></Route>
    </div>
  );
}

export default App;
