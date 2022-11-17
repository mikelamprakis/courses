import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import AddUser from './components/user/AddUserWithUseRef';
import UserList from './components/user/UserList';
import Wrapper from './components/Helpers/Wrapper';

function App() {
  const [userList, setUserList] = useState([]);
  
  const addUserHandler = (uname, uAge) => {
    setUserList((prevUserList) => {
      return [...prevUserList, {name: uname, age:uAge, id:Math.random().toString()}] // name,age-> defined on how the UserList.js exects them to display
    })
  }

  return (
    <Wrapper>
      <AddUser onAddUser={addUserHandler}/>
      <UserList users={userList}/>
    </Wrapper>
  );
}

export default App;
