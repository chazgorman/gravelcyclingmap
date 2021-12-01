import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" dir="ltr" style={{ height: '100%', overflowY: 'hidden' }}>
      <Head>
        {/* PWA primary color */}
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        /> */}

        <link rel="stylesheet" href="https://js.arcgis.com/4.18/esri/css/main.css" />
        <script src="https://js.arcgis.com/4.18/"></script>

        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css"></link> */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.1/css/bulma.min.css"></link>

        {/* <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.9.0/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossOrigin="anonymous" /> */}

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
        <script type="text/javascript" src="/static/attachNavbarBurgerClick.js"></script>
      </Head>
      <body className="has-navbar-fixed-top" style={{height: '100%'}}>
        <Main />
        <NextScript />
      </body>
      </Html>
    )
  }
}

export default MyDocument;
