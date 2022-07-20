import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import {takeEvery, put} from 'redux-saga/effects';
import axios from 'axios';

function* myGenerator() {
    try {
        yield true;
        yield 100;
        yield 'hello!!!!!';
        yield [1, 2, 3];
        yield {key: value};
    }
    catch(error) {
        console.log('error in myGenerator', error)
    }
}

//create instance
const goDogGo = myGenerator();

//call generator with .next()
console.log(goDogGo.next().value);
console.log(goDogGo.next().value);
console.log(goDogGo.next().value);
console.log(goDogGo.next().value);
console.log(goDogGo.next().value);

function* getSwitch() {
    try {
        while(true) {
            yield 'on';
            yield 'off';
        }
    }
    catch(error) {
        console.log('error in getSwitch', error);
    }
}

const toggle = getSwitch();

console.log(toggle.next().value);
console.log(toggle.next().value);
console.log(toggle.next().value);
console.log(toggle.next().value);
console.log(toggle.next().value);
console.log(toggle.next().value);
console.log(toggle.next().value);
console.log(toggle.next().value);
console.log(toggle.next().value);


function* countDownGenerator() {
    let a = 10;
    while (a > 0) {
        yield `launching in ${a}`;
        a -= 1;
    }
    yield 'take off'
}

const countDown = countDownGenerator();

console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);
console.log(countDown.next().value);



const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

// function* firstSaga(action) {
//     console.log('in firstSaga', action);
// }

function* fetchElements() {
    try {
        const elementResponse = yield axios.get('/api/element');
        yield put({type: 'SET_ELEMENTS', payload: elementResponse.data})
    }
    catch(error) {
        console.log('error in fetchElements', error);
    }
}

function* postElement(action) {
    try{
        yield axios.post('/api/element', action.payload);
        yield put({type: 'FETCH_ELEMENTS'})
    }
    catch(error) {
        console.log('error in postElement', error)
    }
}

// this is the saga that will watch for actions
function* watcherSaga() {
    // yield takeEvery('SET_ELEMENTS', firstSaga);
    yield takeEvery('FETCH_ELEMENTS', fetchElements);
    yield takeEvery('ADD_ELEMENT', postElement);
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(watcherSaga);

ReactDOM.render(
    <Provider store={storeInstance}>
        <App/>
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
