import React, { Component } from 'react';
import './TextField.styl';
import { bind } from 'decko';

let multiRoute;

class TextField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            points: ['Москва', 'Казань'],
            input: '',
        }
    }

    componentDidMount() {
        const { points } = this.state;

        ymaps.ready(this.addRoutes.bind(this, points));
    }


    @bind
    deletePoint(i, e) {
        let { points: routes } = this.state;
        routes.splice(i, 1);
        this.setState({
            points: routes
        })

        this.setReferencePoints(routes);
    }

    @bind
    onInputChange(e) {
        this.setState({
            input: e.target.value
        })
    }

    @bind
    onKeyPress(e) {
        if (e.keyCode !== 13 || !this.state.input) return;

        const { points, input } = this.state;
        let routes = [input, ...points];

        this.setState({
            points: routes,
            input: ''
        }, () => {
                // this.addRoutes(routes);
                this.setReferencePoints(routes);
        });
        // this.geocode(input);
    }


    geocode(value) {
        // let { myMap } = this.props;
        //  ymaps.geocode('Нижний Новгород', {
        //         results: 1
        //     }).then(function (res) {
        //         let firstGeoObject = res.geoObjects.get(0),
        //         coords = firstGeoObject.geometry.getCoordinates(),
        //         bounds = firstGeoObject.properties.get('boundedBy');

        //         firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
        //         firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

        //         myMap.geoObjects.add(firstGeoObject);
        //         myMap.setBounds(bounds, {
        //             checkZoomRange: true
        //         });
        // });
    }

    addRoutes(points) {
        if (points.length !== 2) return;

        let { myMap } = this.props;

        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: points,
            params: {
                results: 1
            }
        }, {
            boundsAutoApply: true
        });

        myMap.geoObjects.add(multiRoute);
    }

    @bind
    setReferencePoints(points) {
        console.log(points)
        if (points.length > 1) {
            multiRoute.model.setReferencePoints(points);
        }
    }

    render() {
        const { input, points } = this.state;

        return (
            <div className='textfield'>
                <input type='text' value={input} onChange={this.onInputChange} onKeyDown={this.onKeyPress}/>
                <ul>

                    {points.map((item, i) => <li key={i} className='li'>
                        <div className='text'>{item}</div>
                        <div className='del'
                            onClick={this.deletePoint.bind(this, i)}>
                                <img
                                    className='img'
                                    src={`./image/delete.png`}
                                    alt="delete" /></div>
                    </li>)}
                </ul>
            </div>
        )
    }
}

export default TextField;
