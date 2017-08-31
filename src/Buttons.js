import React, { Component } from 'react';

class Buttons extends Component {

    render() {
        return (
            <div className="btn-group">
                <button className="btn" onClick={() => this.props.onClick(0)}>First Page</button>
                <button className="btn" onClick={() => this.props.onClick(81)}>Page 82</button>
                <button className="btn" onClick={() => this.props.onClick(151)}>Last Page</button>
            </div>
        );
    }

}

export default Buttons;
