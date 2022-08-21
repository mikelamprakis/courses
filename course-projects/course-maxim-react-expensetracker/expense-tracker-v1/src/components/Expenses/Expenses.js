import React, {useState} from "react";
import ExpenseItem from './ExpenseItem';
import ExpensesFilter from './ExpenseFilter'
import ExpensesList from './ExpensesList';
import ExpensesChart from "../Chart/ExpensesChart";
import './Expenses.css';

function Expenses(props){

    const [filteredYear, setFilteredYear] = useState('2020');

    const filterChangeHandler = selectorYear => {
        console.log('Expense.js');
        console.log(selectorYear);
        setFilteredYear(selectorYear);
    }

    const filteredExpenses = props.items.filter(expense => {
        return expense.date.getFullYear().toString() === filteredYear
    })

    

    return (
    <div> 

    <div className="expenses">
       <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler}/>    
        <ExpensesChart expenses={filteredExpenses}/>
       <ExpensesList items={filteredExpenses} />
        {/* {filteredExpenses.length === 0 ? 
        "No Expenses Found" 
        :
        filteredExpenses.map((expense) => (
            <ExpenseItem key={expense.id} title={expense.title} amount={expense.amount} date={expense.date} /> 
        ))} */}

       {/* {filteredExpenses.length === 0 && "No Expenses Found"} */}

       {/* <ExpenseItem title={props.items[0].title} amount={props.items[0].amount} date={props.items[0].date}> </ExpenseItem>
       <ExpenseItem title={props.items[1].title} amount={props.items[1].amount} date={props.items[1].date}> </ExpenseItem>
       <ExpenseItem title={props.items[2].title} amount={props.items[2].amount} date={props.items[2].date}> </ExpenseItem>
       <ExpenseItem title={props.items[3].title} amount={props.items[3].amount} date={props.items[3].date}> </ExpenseItem> */}
    </div>

    </div>
    )

}

export default Expenses;