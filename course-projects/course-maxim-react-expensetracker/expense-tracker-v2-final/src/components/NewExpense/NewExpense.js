import React, {useState} from "react";
import './NewExpense.css';

import ExpenseForm from "./ExpenseForm";


const NewExpense = (props) => { // props include onAddExpense

    const [isEditing, setIsEditing] = useState(false);

    const saveExpenseDataHandler = (enteredExpenseData) => {
        const expenseData = {
            ...enteredExpenseData, 
            id: Math.random().toString()
        }

        props.onAddExpense(expenseData);
        setIsEditing(false)
    }

    const startingEditingHandler = () => {
        setIsEditing(true);
    }

    const stopEditingHandler = () => {
        setIsEditing(false);
    }

    return (
        <div className="new-expense">
           {!isEditing && <button onClick={startingEditingHandler}>Add new expense</button>}
           {isEditing &&  <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} onCancel={stopEditingHandler} />}
        </div>
    )
}

export default NewExpense;
