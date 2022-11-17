import React, {useState} from "react";
import Card from '../ui/Card';
import Button from "../ui/Button";
import classes from './AddUser.module.css'
import ErrorModal from "./ErrorModal";
import Wrapper from "../Helpers/Wrapper";



const AddUser = (props) =>{

    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredAge, setEnteredAge] = useState('');
    const [error, setError] = useState(null);

    const addUserhandler = (event) => {
        event.preventDefault();
        if (enteredUsername.trim()==='' || enteredAge.trim()===0){
            setError({
                title: 'Invalid Input', message: 'Username and age cannot be blank'
            })
            return;
        }
        if (+enteredAge<1){
            setError({
                title: 'Invalid Age', message: 'Age cannot be les that 1'
            })
            return;
        }
        console.log(enteredUsername + ' - ' + enteredAge);
        props.onAddUser(enteredUsername, enteredAge);

        setEnteredUsername('');
        setEnteredAge('');
    }

    const usenameChangeHandler =(event) =>{
        setEnteredUsername(event.target.value);
    }

    const ageChangeHandler =(event) =>{
        setEnteredAge(event.target.value);
    }

    const errorHandler = () => {
        setError(null);
    }

   return (
    <Wrapper>
        {error && <ErrorModal title={error.title} message={error.message} onConfirm={errorHandler} />}
        <Card className={classes.input}>
            <form onSubmit={addUserhandler}>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" value={enteredUsername} onChange={usenameChangeHandler}/>

                <label htmlFor="age">Age (Years)</label>
                <input id="age" type="number" value={enteredAge} onChange={ageChangeHandler}/>

                <Button type="submit">Add User</Button>
            </form>
        </Card>
    </Wrapper>
   )
};

export default AddUser;
