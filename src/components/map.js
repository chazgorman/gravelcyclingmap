import React from 'react';
import PropTypes from "prop-types"
import { withApollo } from 'react-apollo';

import { loadModules } from 'esri-loader';
import AgolFeatureLyr from './AgolFeatureLayer'
import GraphqlLyr from './GraphqlFeatureLayer'

import gql from 'graphql-tag'

export const allMsgsQuery = gql`
{
      messages {
        harvest_id
        contributor_screen_name
        contributor_name
        message
        message_id
        time
        like_count
        twitter_favorite_count
        twitter_favorite_count
        network
        location
    }
  }
`
export const messagesQueryVars = {
  skip: 0,
  first: 10
}

class EsriMap extends React.Component {
  constructor(props) {
    super(props);

    this.featuresSet = false;

    this.extentChanged = this.extentChanged.bind(this);
    this.viewImmediateClick = this.viewImmediateClick.bind(this);
  }
  componentDidMount() {
    var thisMap = this;
    // first, we use Dojo's loader to require the map class
    loadModules(['esri/Map','esri/views/SceneView'])
      .then(([Map, SceneView]) => {

        var map = new Map({
          basemap: "topo",
          ground: "world-elevation"
        });

        var view = new SceneView({
          container: "map",  // Reference to the DOM node that will contain the view
          map: map  // References the map object created in step 3
        });

        let graphqlLayer = new GraphqlLyr("graphql", "", view, thisMap.props.getMapMarkers, thisMap.props.client);
        graphqlLayer.loadLayer();

        return view;
      }).then(map => {
        this.map = map;
        
        this.mapExtentChange = map.on("extent-change", this.extentChanged.bind(this));

        map.on("immediate-click", thisMap.viewImmediateClick);
        //this.props.getMapMarkers(this);
      })
      .catch(err => {
        // handle any errors
        console.error(err);
      });
  }
  extentChanged(evt) {

  }
  viewImmediateClick(evt){
    console.log("In viewImmediateClick");
    var thisMap = this;
    this.map.hitTest(evt).then(function(response) {
      // check if a feature is returned from the hurricanesLayer
      // do something with the result graphic
      console.log(response.results);

      if(response.results[0].graphic != undefined){
        let activeMsgId = response.results[0].graphic.attributes.message_id;
        console.log("Active Message: ", activeMsgId);

        //this.props.client.writeData({ data: { activeMessage: activeMsgId } });
      }
    });
  }
  render() {
    console.log("EsriMap: ", this);

    return (
      <div
        ref={c => {
          this.mapNode = c;
        }}
      />
    )
  }
}

EsriMap.propTypes = {
  getMapMarkers: PropTypes.func,
  updateMapMarkers: PropTypes.func
};

export default withApollo(EsriMap);