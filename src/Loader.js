import React, {Component} from 'react';

class Loader extends Component {

    render() {
        return (
            <div className="loader">
                <div className="loader-invert line-scale">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }

}

export default Loader;
