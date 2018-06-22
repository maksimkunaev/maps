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


    async onKeyPress(e) {
        if (e.keyCode !== 13 || !this.state.input) return;

        const { points, input } = this.state;
        const adress = await this.geocode(input);

        let routes = [adress, ...points];

        this.setState({
            points: routes,
            input: ''
        }, () => {
                // this.addRoutes(routes);
                this.setReferencePoints(routes);
        });
    }


    async geocode(value) {
        let { myMap } = this.props;
        let adress;

         await ymaps.geocode(value, {
                results: 1
            }).then(function (res) {
                let firstGeoObject = res.geoObjects.get(0),

                coords = firstGeoObject.geometry.getCoordinates(),
                bounds = firstGeoObject.properties.get('boundedBy');

                firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
                firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

                myMap.geoObjects.add(firstGeoObject);
                myMap.setBounds(bounds, {
                    checkZoomRange: true
                });
                adress = firstGeoObject.properties.get('name');
        });
        return adress;
    }

    addRoutes(points) {
        let { myMap } = this.props;

        if (points.length !== 2) return;

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
        if (points.length > 1) {
            multiRoute.model.setReferencePoints(points);
        }
    }

    @bind
    onDragAndDrop(e) {
        let li = e.target;

        if (li.className === 'del' || li.className === 'img') return;

        let coords = this.getCoords(li);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;

        li.style.position = 'absolute';
        moveAt(e, true);

        li.style.zIndex = 1000;

        function moveAt(e, first) {
            if (first) li.style.left = e.pageX - shiftX + 'px';
            li.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = e => {
            moveAt(e);
        };


        document.onmouseup = e => {
            li.style.display = 'none';

            let elem = document.elementFromPoint(e.clientX, e.clientY);
            let closestLi = elem.closest('li')

            li.style.position = '';
            li.style.display = '';

            if (closestLi) {
                let i = li.getAttribute('data-id');
                let attr = closestLi.getAttribute('data-id');
                let { points: routes } = this.state;

                //меняем элементы массива местами
                routes[attr] = routes.splice(i, 1, routes[attr])[0];
                this.setState({
                    points: routes
                })
                this.setReferencePoints(routes)
            }
            document.onmousemove = null;
            document.onmouseup = null;
        };

        li.ondragstart = () => {
          return false;
        };

    }

    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    }

    render() {
        const { input, points } = this.state;

        return (
            <div className='textfield'>
                <input
                    placeholder='Add address'
                    className='input'
                    type='text'
                    value={input}
                    onChange={this.onInputChange}
                    onKeyDown={this.onKeyPress.bind(this)}/>
                    <ul className='list'>
                        {points.map((item, i) => <li
                            key={i}
                            data-id={i}
                            className='li'
                            onMouseDown={this.onDragAndDrop}>
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
