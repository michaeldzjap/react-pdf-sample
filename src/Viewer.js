import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document, Page }  from 'react-pdf/build/entry.noworker';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css';

import Loader from './Loader';
import Buttons from './Buttons';

class Viewer extends Component {

    static propTypes = {
        scale: PropTypes.number.isRequired
    }

    static defaultProps = {
        scale: 1.2
    }

    constructor(props) {
        super(props);

        this.state = {pdf: null, cachedPageHeights: null, responsiveScale: null, currentPage: 1};
        this._pages = new Map();
        this._callOrientationChangeHandler = this.handleResize.bind(this);
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    componentDidUpdate() {
        if (this.state.cachedPageHeights && !this.state.responsiveScale) {
            const node = this._pages.get(this.state.currentPage);
            if (node) {
                this.setState({
                    responsiveScale: this.state.cachedPageHeights.get(1) / node.clientHeight
                }, () => this._list.recomputeRowHeights());
            }
        }
    }


    onDocumentLoadSuccess(pdf) {
        this.setState({pdf});
        this.cachePageHeights(pdf);
    }

    /**
     * Load all pages so we can cache all page heights.
     *
     * @param {object} pdf
     * @return {void|null}
     */
    cachePageHeights(pdf) {
        const promises = Array
            .from({length: pdf.numPages}, (v, i) => i + 1)
            .map(pageNumber => pdf.getPage(pageNumber));

        // Assuming all pages may have different heights. Otherwise we can just
        // load the first page and use its height for determining all the row
        // heights.
        Promise.all(promises).then(values => {
            if (!this._mounted) {
                return null;
            }

            const pageHeights = values.reduce((accPageHeights, page) => {
                accPageHeights.set(page.pageIndex + 1, page.pageInfo.view[3] * this.props.scale);
                return accPageHeights;
            }, new Map());

            this.setState({cachedPageHeights: pageHeights});
        });
    }

    computeRowHeight({index}) {
        const { cachedPageHeights, responsiveScale } = this.state;
        if (cachedPageHeights && responsiveScale) {
            return (cachedPageHeights.get(index + 1) / responsiveScale);
        }

        return 768;
    }

    updateCurrentVisiblePage({stopIndex}) {
        this.setState({currentPage: stopIndex + 1});
    }

    handleResize() {
        // Recompute the responsive scale factor on window resize
        const node = this._pages.get(this.state.currentPage);
        const responsiveScale = this.state.cachedPageHeights.get(this.state.currentPage) / node.clientHeight;
        if (responsiveScale !== this.state.responsiveScale) {
            this.setState({responsiveScale}, () => this._list.recomputeRowHeights());
        }
    }

    handleClick(index) {
        this._list.scrollToRow(index);
    }

    rowRenderer({key, index, style}) {
        const pageNumber = index + 1;

        return (
            <div style={style} key={key}>
                <div ref={ref => this._pages.set(pageNumber, ref)}>
                    <Page
                        pdf={this.state.pdf}
                        pageNumber={pageNumber}
                        scale={this.props.scale}
                        onLoadError={error => console.error(error)} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <Document
                file="./test.pdf"
                loading={<Loader />}
                onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                onLoadError={error => console.error(error)}
            >
                <Buttons numPages={this.state.pdf && this.state.pdf.numPages} onClick={this.handleClick.bind(this)} />
                <WindowScroller onResize={this.handleResize.bind(this)}>
                    {
                        ({height, isScrolling, onChildScroll, scrollTop}) => (
                            <AutoSizer disableHeight>
                                {
                                    ({width}) => (
                                        <List
                                            autoheight
                                            height={height}
                                            width={width}
                                            isScrolling={isScrolling}
                                            onRowsRendered={this.updateCurrentVisiblePage.bind(this)}
                                            onScroll={onChildScroll}
                                            scrollToAlignment="start"
                                            scrollTop={scrollTop}
                                            overscanRowCount={5}
                                            rowCount={this.state.pdf.numPages}
                                            rowHeight={this.computeRowHeight.bind(this)}
                                            rowRenderer={this.rowRenderer.bind(this)}
                                            style={{outline: 'none'}}
                                            ref={ref => this._list = ref} />
                                    )
                                }
                            </AutoSizer>
                        )
                    }
                </WindowScroller>
            </Document>
        );
    }

}

export default Viewer;
