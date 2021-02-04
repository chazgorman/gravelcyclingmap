import React from 'react';
import PropTypes from "prop-types"
import EsriModalMap from './modalmap'
import { Query, gql } from '@apollo/client';

export const mediaForMsgQuery = gql`
query($messageid: String) {
    shared_links(where: {message_id: {_eq: $messageid}}) {
          message_id
          url
          expanded_url
          source
          host
          location
          preview
    }
  }`

class SideMedia extends React.Component {
    constructor(props) {
        super(props);

        this.state = { zooming: false, showModal: true, showMedia: true, sharedLinks: [] };
    }
    showModal() {
        var value = this.state.showModal === true ? false : true;

        this.setState({ showModal: value, showMap: !value });
    }
    showModalMedia() {
        this.setState({ showModal: true, showMedia: true, showMap: false });
    }
    showModalMap() {
        this.setState({ showModal: true, showMedia: false, showMap: true });
    }
    setSharedLinks(sharedLinks) {
        this.setState({ sharedLinks: sharedLinks });
    }
    zoomTo() {
        console.log("In zoomTo", this.props.geometry);
        var card = this;
        var geom = this.props.geometry;
        var map = this.props.map;
        this.setState({ zooming: true });

        var options = {
            target: geom,
            zoom: 12,
            tilt: 45
        };
        map.goTo(options).then(function (result) {
            card.setState({ zooming: false });
        })
    }
    render() {
        var buttonClassname = "button is-link is-hidden-desktop";
        if (this.state.zooming) {
            buttonClassname += " is-loading";
        } else if (this.props.selected) {
            buttonClassname += "is-success is-outlined";
        }

        var retweetLink = "https://twitter.com/intent/retweet?tweet_id=" + this.props.mediaId;
        var replyToLink = "https://twitter.com/intent/tweet?in_reply_to=" + this.props.mediaId;
        var likeLink = "https://twitter.com/intent/like?tweet_id=" + this.props.mediaId;

        var imageModal = undefined;

        var mediaLinkButton = undefined;
        var mediaImage = undefined; //"https://www.instagram.com/p/BtbXwXgFqevg2e_zNtzD9ED8HPodoyLbi0KoA00/media?size=l"
        var directLink = undefined;

        return (
            <Query
                query={mediaForMsgQuery}
                variables={{ messageid: this.props.mediaId }}
            >
                {({ loading, error, data }) => {
                    if (loading) return <div className="button is-loading"></div>;
                    if (error) return <p>Error</p>;

                    var sharedLinks = data.shared_links;

                    if (sharedLinks !== undefined && sharedLinks.length > 0) {
                        var mediaUrl = sharedLinks[0].expanded_url;

                        if (mediaUrl.startsWith("https://www.instagram.com")) {
                            mediaLinkButton = (
                                <div className="button is-hidden-touch" onClick={this.showModalMedia.bind(this)}>
                                    <i className="fab fa-instagram"></i>
                                </div>
                            )

                            directLink = sharedLinks[0].url;
                            mediaImage = sharedLinks[0].preview;
                        }
                        else {
                            mediaLinkButton = (
                                <div className="button is-hidden-touch" onClick={this.showModalMedia.bind(this)}>
                                    <i className="far fa-image"></i>
                                </div>
                            )

                            mediaImage = sharedLinks[0].source;
                        }
                    }

                    // ----------
                    var mobileMapButtonGroup = (<div className="buttons">
                        <div className={buttonClassname} onClick={this.showModalMap.bind(this)}>
                            <i className="fas fa-globe" color="blue"></i>
                        </div>
                        <button className="delete" aria-label="close" onClick={this.props.hideImage}></button>
                    </div>)

                    var imageModal = undefined;

                    if (this.state.showModal && this.state.showMedia == true) {
                        imageModal = (
                            <article className="message">
                                <div className="message-header">
                                    <p>@{this.props.username}</p>
                                    {mobileMapButtonGroup}
                                </div>
                                <section className="message-body">
                                    <div className="image is-2by2">
                                        <a href={directLink} target="_blank" title="Click image to view on Instagram."><img src={mediaImage} alt="View on Instagram"/></a>
                                    </div>
                                    <div>
                                        <p>{this.props.text}</p>
                                    </div>
                                </section>
                            </article>
                        );
                    }
                    else if (this.state.showModal && this.state.showMap == true) {
                        this.map = (<EsriModalMap containerId={this.props.mediaId} geometry={this.props.geometry} />);
                        imageModal = (
                            <article className="message">
                                <div className="message-header">
                                    <p>@{this.props.username}</p>
                                    {mobileMapButtonGroup}
                                </div>
                                <section className="message-body">
                                    <div id={this.props.mediaId} style={{ height: "60vh" }}></div>
                                    <div>
                                        <p>{this.props.text}</p>
                                    </div>
                                </section>
                                {this.map}
                            </article>
                        );
                    }

                    return (
                        <article className="media">
                            {imageModal}
                        </article>
                    );
                }}
            </Query>
        );
    }
}

SideMedia.propTypes = {
    text: PropTypes.string,
    profilePic: PropTypes.string,
    fullname: PropTypes.string,
    username: PropTypes.string,
    tags: PropTypes.array,
    geometry: PropTypes.object,
    zoomTo: PropTypes.func,
    mediaLink: PropTypes.string,
    mediaId: PropTypes.string,
    mediaData: PropTypes.object,
    map: PropTypes.object,
    date: PropTypes.string,
    hideImage: PropTypes.func
};

export default SideMedia;