import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { Document } from 'react-pdf';
import { VariableSizeList } from 'react-window';
import { debounce } from 'throttle-debounce';

import Loader from './Loader';
import PageRenderer from './PageRenderer';
import Buttons from './Buttons';

class Viewer extends PureComponent {
    static propTypes = {
        scale: PropTypes.number.isRequired,
    };

    static defaultProps = {
        scale: 1.2,
    };

    constructor(props) {
        super(props);

        this.state = {
            containerHeight: window.innerHeight,
            pdf: null,
            currentPage: 1,
            cachedPageDimensions: null,
            responsiveScale: 1,
            pageNumbers: new Map(),
            pages: new WeakMap(),
        };

        this._list = createRef();

        this._callResizeHandler = debounce(50, this.handleResize.bind(this));
        this._callOrientationChangeHandler = debounce(1000, this.handleResize.bind(this));
    }

    componentDidMount() {
        this._mounted = true;
        window.addEventListener('resize', this._callResizeHandler);
        window.addEventListener('orientationchange', this._callOrientationChangeHandler);
    }

    componentWillUnmount() {
        this._mounted = false;
        window.removeEventListener('resize', this._callResizeHandler);
        window.removeEventListener('orientationchange', this._callOrientationChangeHandler);
    }

    /**
     * Load all pages so we can cache all page dimensions.
     *
     * @param {Object} pdf
     * @returns {void}
     */
    cachePageDimensions(pdf) {
        const promises = Array.from({ length: pdf.numPages }, (v, i) => i + 1).map((pageNumber) => {
            return pdf.getPage(pageNumber);
        });

        // Assuming all pages may have different heights. Otherwise we can just
        // load the first page and use its height for determining all the row
        // heights.
        Promise.all(promises).then((pages) => {
            if (!this._mounted) {
                return;
            }

            const pageDimensions = new Map();

            for (const page of pages) {
                const w = page.view[2] * this.props.scale;
                const h = page.view[3] * this.props.scale;

                pageDimensions.set(page._pageIndex + 1, [w, h]);
            }

            this.setState({ cachedPageDimensions: pageDimensions });
        });
    }

    recomputeRowHeights() {
        this._list.current.resetAfterIndex(0);
    }

    computeRowHeight(index) {
        const { cachedPageDimensions, responsiveScale } = this.state;

        if (cachedPageDimensions && responsiveScale) {
            return cachedPageDimensions.get(index + 1)[1] / responsiveScale;
        }

        return 768; // Initial height
    }

    onDocumentLoadSuccess(pdf) {
        this.setState({ pdf });
        this.cachePageDimensions(pdf);
    }

    updateCurrentVisiblePage({ visibleStopIndex }) {
        this.setState({ currentPage: visibleStopIndex + 1 });
    }

    computeResponsiveScale(pageNumber) {
        const { cachedPageDimensions, pages, pageNumbers } = this.state;

        const node = pages.get(pageNumbers.get(pageNumber));

        if (!node) return;

        return cachedPageDimensions.get(pageNumber)[1] / node.clientHeight;
    }

    handleResize() {
        const { currentPage, responsiveScale } = this.state;

        // Recompute the responsive scale factor on window resize
        const newResponsiveScale = this.computeResponsiveScale(currentPage);

        if (newResponsiveScale && responsiveScale !== newResponsiveScale) {
            this.setState({ responsiveScale: newResponsiveScale }, () => this.recomputeRowHeights());
        }

        this.setState({ containerHeight: window.innerHeight });
    }

    handleClick(index) {
        this._list.current.scrollToItem(index);
    }

    render() {
        const { scale } = this.props;
        const { cachedPageDimensions, containerHeight, pdf, pages, pageNumbers } = this.state;

        return (
            <Document
                file="./test.pdf"
                loading={<Loader />}
                onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                onLoadError={(error) => console.error(error)} // eslint-disable-line no-console
            >
                {cachedPageDimensions && (
                    <Fragment>
                        <Buttons numPages={pdf.numPages} onClick={this.handleClick.bind(this)} />
                        <VariableSizeList
                            height={containerHeight}
                            itemCount={pdf.numPages}
                            itemSize={this.computeRowHeight.bind(this)}
                            itemData={{
                                scale,
                                pages,
                                pageNumbers,
                                numPages: pdf.numPages,
                                triggerResize: this.handleResize.bind(this),
                            }}
                            overscanCount={2}
                            onItemsRendered={this.updateCurrentVisiblePage.bind(this)}
                            ref={this._list}
                        >
                            {PageRenderer}
                        </VariableSizeList>
                    </Fragment>
                )}
            </Document>
        );
    }
}

export default Viewer;
