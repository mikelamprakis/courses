import React from "react";
import ReactDOM from "react-dom";
import Wrapper from "../Helpers/Wrapper";
import Button from "../ui/Button";
import Card from "../ui/Card";
import classes from './ErrorModal.module.css';

const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onConfirmFromBackdrop}/>   ;
}

const ModalOverlay = (props) => {
    return (
        <Card className={classes.modal}>
            <header className={classes.header}>
                <h2>{props.title}</h2>
            </header>
            <div className={classes.content}>
                <p>{props.message}</p>
            </div>
            <footer className={classes.actions}>
                <Button onClick={props.onConfirmFromModalOverlay}>Okay</Button>
            </footer>
        </Card>
    )
}

const ErrorModal = (props) => {
    return (
        <Wrapper>
            {ReactDOM.createPortal( <Backdrop onConfirmFromBackdrop={props.onConfirm}/>, 
             document.getElementById('backdrop-root'))}

            {ReactDOM.createPortal( <ModalOverlay title={props.title} message={props.message} onConfirmFromModalOverlay={props.onConfirm}/>,
             document.getElementById('overlay-root'))}
        </Wrapper>
    )
}

export default ErrorModal;