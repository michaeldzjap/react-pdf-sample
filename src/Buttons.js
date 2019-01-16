import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Buttons extends Component {

    static propTypes = {
        onClick: PropTypes.func.isRequired,
        numPages: PropTypes.number.isRequired
    }

    render() {
        return (
            <div className="btn-group">
                <button className="btn" onClick={() => this.props.onClick(0)}>
                    First Page
                </button>
                <button
                    className="btn"
                    onClick={
                        () => (
                            this.props.onClick(
                                Math.floor((this.props.numPages - 1) / 2)
                            )
                        )
                    }
                >
                    Middle Page
                </button>
                <button
                    className="btn"
                    onClick={() => this.props.onClick(this.props.numPages - 1)}
                >
                    Last Page
                </button>
            </div>
        );
    }

}

export default Buttons;
