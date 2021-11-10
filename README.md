![dependencies](https://img.shields.io/librariesio/github/michaeldzjap/react-pdf-sample)

# react-pdf-sample
A [react-pdf](https://github.com/wojtekmaj/react-pdf) + ~~[react-virtualized](https://github.com/bvaughn/react-virtualized)~~ [react-window](https://github.com/bvaughn/react-window) sample project

## Installation
- `npm install`
- `npm run dev`, `npm run prod` or `npm run watch`

**Note**: to serve the included sample pdf over http use something like [http-server](https://github.com/indexzero/http-server)

## Current Issues
- ~~Currently there is an [issue](https://github.com/wojtekmaj/react-pdf/issues/49) with react-pdf's `Page` component in combination with react-virtualized's `CellMeasurer` component, where it seems `setState({})` is being called after the `Page` component has been unmounted. This might only be an issue occurring on Chrome browsers, since Firefox doesn't print any warnings about this in the console.~~
- ~~Scrolling to a specific row using `list.scrollToRow()` does not seem to work properly. When clicking the button "Page 82" you should be directed to page 70 of the included sample pdf (the page that shows figure 4.2). When you click the "Page 82" button twice it seems you are directed to the right page. Clicking the "Last Page" button twice does not direct you to the right page however.~~
- ~~On _Firefox_ the pdf pages are flickering on scroll. This might be solvable by adding the following optimisation to `Page`~~
- ~~Scrolling up/back after scrolling to a page using `list.scrollToRow()` causes jumpy behavior. [This](https://github.com/bvaughn/react-virtualized/issues/610) might be related?~~
- ~~Scrolling using `scrollToItem()` of _react-window_ doesn't seem to be working.~~
