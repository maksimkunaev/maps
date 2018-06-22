import React, { Component } from 'react';
import './Map.styl';
import { bind } from 'decko';

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
    }

    // componentDidMount() {
    //     ymaps.ready(this.makeMap);
    // }

    // makeMap() {
    //     let myMap;

    //     myMap = new ymaps.Map('map', {
    //         center: [55.76, 37.64],
    //         zoom: 10
    //     }, {
    //         searchControlProvider: 'yandex#search'
    //     });
    // }

    @bind
    onBtnClick() {
        this.setState({
            open: !this.state.open
        })
    }

    render() {

        return (
            <div id='map'>

            </div>
        )
    }
}

export default Map;
