import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import withApolloClient from '../src/lib/with-apollo-client'
import { ApolloProvider } from '@apollo/client';
import '../public/static/BulmaCustom.css'

class MyApp extends App {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <>
        <Head>
          <title>Gravel Cycling Map</title>
          <meta charSet="utf-8" />
         {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              'user-scalable=0, initial-scale=1, ' +
              'minimum-scale=1, width=device-width, height=device-height'
            }
          />
        </Head>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </>
    )
  }
}

export default withApolloClient(MyApp)