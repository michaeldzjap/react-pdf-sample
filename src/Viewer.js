import React, { Component } from 'react';
import { Document, Page }  from 'react-pdf/build/entry.noworker';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css';

import Loader from './Loader';

class Viewer extends Component {

    constructor(props) {
        super(props);

        this.state = {pdf: null, scale: 1.2};
        this._cache = new CellMeasurerCache({defaultHeight: 768, fixedWidth: true});
    }

    onDocumentLoadSuccess(pdf) {
        this.setState({pdf});
    }

    handleResize() {
        this._cache.clearAll();     // Reset the cached measurements for all cells
    }

    renderError() {
        return (
            <p className="text-danger text-center">PDF failed to load!</p>
        );
    }

    rowRenderer({key, index, style, parent}) {
        return (
            <CellMeasurer cache={this._cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                {
                    ({measure}) => (
                        <div style={style}>
                            <Page
                                onLoadSuccess={measure}
                                renderTextLayer={false}
                                pdf={this.state.pdf}
                                pageNumber={index + 1}
                                scale={this.state.scale} />
                        </div>
                    )
                }
            </CellMeasurer>
        );
    }

    render() {
        return (
            <Document
                file="./thesis_michael_dzjap_final.pdf"
                loading={<Loader />}
                error={this.renderError()}
                onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
            >
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
                                            onScroll={onChildScroll}
                                            scrollTop={scrollTop}
                                            overscanRowCount={5}
                                            rowCount={this.state.pdf.numPages}
                                            deferredMeasurementCache={this._cache}
                                            rowHeight={this._cache.rowHeight}
                                            rowRenderer={this.rowRenderer.bind(this)}
                                            style={{outline: 'none'}} />
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
