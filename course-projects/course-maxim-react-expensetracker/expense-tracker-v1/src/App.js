import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

import NewExpense from './components/NewExpense/NewExpense';

import Expenses from './components/Expenses/Expenses';


const DUMMY_EXPENSES = [
  {title: 'expense one', amount: 294.7, date: new Date (2022, 2, 15)},
  {title: 'expense two', amount: 280.4, date: new Date (2022, 5, 19)},
  {title: 'expense three', amount: 250.1, date: new Date (2022, 8, 22)},
  {title: 'expense four', amount: 230.5, date: new Date (2022, 6, 26)}
]

function App() {

  
  const [expenses, setExpenses] = useState(DUMMY_EXPENSES);

  const addExpensesHandler = expense => {
    console.log('In App.js');
    console.log(expenses);
    //setExpenses([expense, ...expenses]);
    setExpenses((prevExpenses) => {
      return [expense, ...prevExpenses]
    });
  };

  return (
    <div className="App">
      <header className="App-header">

       <NewExpense onAddExpense={addExpensesHandler}/>
       <Expenses items={expenses}/>
      
      </header>
    </div>
  );
}



export default App;
