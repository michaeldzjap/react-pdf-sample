import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Page } from 'react-pdf';

class PageRenderer extends PureComponent {
    static propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
    };

    render() {
        const { index, data, style } = this.props;
        const { scale, numPages, triggerResize } = data;

        const pageNumber = index + 1;

        return (
            <div {...{ style }}>
                <div
                    ref={(ref) => {
                        const { pages, pageNumbers } = this.props.data;

                        if (!pageNumbers.has(pageNumber)) {
                            const key = { pageNumber };
                            pageNumbers.set(pageNumber, key);
                        }

                        pages.set(pageNumbers.get(pageNumber), ref);
                    }}
                >
                    <Page
                        {...{ pageNumber }}
                        {...{ scale }}
                        renderAnnotationLayer={false}
                        onLoadError={(error) => console.error(error) /* eslint-disable-line no-console */}
                        onLoadSuccess={(page) => {
                            // This is necessary to ensure the row heights of
                            // the variable list are correctly initialised.
                            if (page.pageNumber === numPages) {
                                triggerResize();
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default PageRenderer;
