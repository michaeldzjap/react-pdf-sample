import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Page} from 'react-pdf/dist/entry.webpack';

class PageRenderer extends PureComponent {

    static propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired
    }

    render() {
        const {index, data, style} = this.props;
        const {cachedPageDimensions, scale, _pages} = data;

        const pageNumber = index + 1;
        const pageDimensions = cachedPageDimensions.get(pageNumber);

        return (
            <div {...{style}}>
                <div ref={ref => _pages.set(pageNumber, ref)}>
                    <Page
                        {...{pageNumber}}
                        {...{scale}}
                        renderAnnotationLayer={false}
                        onLoadError={error => console.error(error)} /> {/* eslint-disable-line no-console */}
                </div>
            </div>
        );
    }

}

export default PageRenderer;
