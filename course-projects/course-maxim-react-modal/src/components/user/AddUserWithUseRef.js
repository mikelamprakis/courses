import React, {useState, useRef} from "react";
import Card from '../ui/Card';
import Button from "../ui/Button";
import classes from './AddUser.module.css'
import ErrorModal from "./ErrorModal";
import Wrapper from "../Helpers/Wrapper";



const AddUser = (props) =>{

    const nameInputRef = useRef();
    const ageInputRef = useRef();

    const [error, setError] = useState(null);

    const addUserhandler = (event) => {
        event.preventDefault();
        const enteredName = nameInputRef.current.value;
        const enteredAge = ageInputRef.current.value;
        if (enteredName.trim()==='' || enteredAge.trim()===0){
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
        console.log(enteredName + ' - ' + enteredAge);
        props.onAddUser(enteredName, enteredAge);
        nameInputRef.current.value='';
        ageInputRef.current.value='';
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
                <input id="username" type="text" ref={nameInputRef}/>

                <label htmlFor="age">Age (Years)</label>
                <input id="age" type="number" ref={ageInputRef}/>

                <Button type="submit">Add User</Button>
            </form>
        </Card>
    </Wrapper>
   )
};

export default AddUser;
