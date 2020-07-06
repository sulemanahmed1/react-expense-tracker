import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import { axios } from 'axios';
// initial state
const initialState = {
    transactions: [],
    error: null,
    loading: true
}

// create context 
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    // actions 
    async function getTransactions() {
        try {
            console.log("1")
            const response = await fetch('http://localhost:8080/api/transactions')
            const data = await response.json();
            console.log("2")
            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: data._embedded.transactions
            })
            console.log("3")
        } catch (error) {
            console.log("error")
        }
    }

    async function deleteTransaction(id) {
        try {

            console.log("1")
            const response = await fetch(`http://localhost:8080/api/transactions/${id}`, {
                method: 'DELETE',
            })
            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id
            });
            console.log("2")

            console.log("3")
        } catch (error) {
            console.log("error with deleting");
        }
    }

    async function addTransaction(transaction) {
        const config = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        }

        try {
            const response = await fetch('http://localhost:8080/api/transactions',config)
            const data = await response.json();
            console.log("added to db")
            console.log(data)
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: data
            });
            console.log("adding to page")
        } catch (error) {
            console.log("error adding")
        }

    }

    return (<GlobalContext.Provider value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction
    }}>
        {children}
    </GlobalContext.Provider>);
}