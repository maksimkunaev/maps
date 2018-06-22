import React, { Component } from 'react';
import './App.styl';
import { bind } from 'decko';
import Map from '../Map/Map.jsx';
import TextField from '../TextField/TextField.jsx';

let myMap;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
           loaded: false
        }
    }

    componentDidMount() {
        ymaps.ready(this.makeMap);
    }

    @bind
    makeMap() {
        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });
        this.setState({
            loaded: true
        })

    }

    render() {
        const { loaded } = this.state;

        return (
            <div className='App'>
                {loaded ? <TextField myMap={myMap} /> : null}
                <Map />
            </div>
        )
    }
}

export default App;
