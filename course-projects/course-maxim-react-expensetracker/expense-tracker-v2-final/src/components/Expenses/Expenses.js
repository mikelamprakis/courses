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
        </div>
    </div>
    )

}
export default Expenses;