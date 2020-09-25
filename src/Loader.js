import React, { PureComponent } from 'react';

class Loader extends PureComponent {
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
