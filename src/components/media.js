import PropTypes from "prop-types"
import Link from 'next/link'
import { withApollo } from 'react-apollo';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import EsriModalMap from './modalmap'

export const mediaForMsgQuery = gql`
query($messageid: String) {
    shared_links(where: {message_id: {_eq: $messageid}}) {
          message_id
          url
          expanded_url
          source
          host
          location
    }
  }`

class Media extends React.Component {

    constructor(props) {
        super(props);

        this.state = { zooming: false, showMedia: false, sharedLinks: [] };
        var thisMedia = this;

        // this.props.client.query({
        //     query: mediaForMsgQuery,
        //     variables: {
        //         messageid: this.props.mediaId
        //     }
        // }).then(result => thisMedia.setState({ sharedLinks: result.data }));
    }
    showMedia() {
        var value = this.state.showMedia === true ? false : true;

        this.setState({ showMedia: value, showMap: !value });
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

        map.centerAndZoom(geom, 14).then(function (result) {
            card.setState({ zooming: false });
        })
    }
    zoomToModal() {
        console.log("In zoomTo", this.props.geometry);

        this.setState({ showMap: true, showMedia: true });
    }
    render() {
        var buttonClassname = "button is-link";
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
                                <div className="button" onClick={this.showMedia.bind(this)}>
                                    <i className="fab fa-instagram"></i>
                                </div>
                            )

                            var linkParts = mediaUrl.split("?");
                            if (linkParts != undefined && linkParts.length == 2) {
                                mediaImage = linkParts[0] + "media?size=l";
                            }
                        }
                        else {
                            mediaLinkButton = (
                                <div className="button" onClick={this.showMedia.bind(this)}>
                                    <i className="far fa-image"></i>
                                </div>
                            )

                            mediaImage = mediaUrl;
                        }
                    }

                    var mapLinkButtonMobile = (<div className="is-hidden-desktop">
                        <div className={buttonClassname} onClick={this.zoomToModal.bind(this)}>
                            <i className="fas fa-search" color="blue"></i>
                        </div>
                    </div>)

                    var mapLinkButtonDesktop = (<div className="is-hidden-touch">
                        <div className={buttonClassname} onClick={this.zoomTo.bind(this)}>
                            <i className="fas fa-search" color="blue"></i>
                        </div>
                    </div>)

                    if (this.state.showMedia && this.state.showMap == false) {
                        imageModal = (
                            <div className="modal is-active" style={{ zIndex: '1005' }}>
                                <div className="modal-background"></div>
                                <div className="modal-card">
                                    <header className="modal-card-head">
                                        <p className="modal-card-title"><strong>{this.props.fullname}</strong> <small>{this.props.time}</small></p>  
                                        <div className="buttons">
                                            {mapLinkButtonMobile}
                                            <button className="delete" aria-label="close" onClick={this.showMedia.bind(this)}></button>
                                        </div>                                      
                                    </header>
                                    <section className="modal-card-body">
                                        <p className="image is-2by2">
                                            <img src={mediaImage} alt="" />
                                        </p>
                                    </section>
                                    <footer className="modal-card-foot">
                                        <p>{this.props.text}</p>
                                    </footer>
                                </div>
                            </div>
                        );
                    }
                    else if(this.state.showMedia && this.state.showMap)
                    {
                        this.map = (<EsriModalMap geometry={this.props.geometry} />);
                        imageModal = (
                            <div className="modal is-active" style={{ zIndex: '1005' }}>
                                <div className="modal-background"></div>
                                <div className="modal-card">
                                    <header className="modal-card-head">
                                        <p className="modal-card-title"><strong>{this.props.fullname}</strong> <small>{this.props.time}</small></p>
                                        <div className="buttons">
                                            {mediaLinkButton}
                                            <button className="delete" aria-label="close" onClick={this.showMedia.bind(this)}></button>
                                        </div>
                                    </header>
                                    <section className="modal-card-body">
                                        <div id="modal-map"></div>                                        
                                    </section>
                                    <footer className="modal-card-foot">
                                        <p>{this.props.text}</p>
                                    </footer>
                                </div>
                                {this.map}
                            </div>
                        );
                    }

                    var linkUrl = "/map?zoomto=" + this.props.mediaId;

                    return (
                        <article className="media">
                            <figure className="media-left">
                                <p className="image is-48x48">
                                    <img className="is-rounded" src={this.props.profilePic} alt="Placeholder image" />
                                </p>
                            </figure>
                            <div className="media-content">
                                <div className="content">
                                    <p>
                                        <strong>{this.props.fullname}</strong> <small>{this.props.username}</small> <small>{this.props.time}</small>
                                        <br />
                                        {this.props.text}
                                    </p>
                                </div>
                                <nav className="level is-mobile">
                                    <div className="level-left">
                                        <a className="level-item" target="_blank" href={replyToLink}>
                                            <span className="icon is-small"><i className="fas fa-reply"></i></span>
                                        </a>
                                        <a className="level-item" target="_blank" href={retweetLink}>
                                            <span className="icon is-small"><i className="fas fa-retweet"></i></span>
                                        </a>
                                        <a className="level-item" target="_blank" href={likeLink}>
                                            <span className="icon is-small"><i className="fas fa-heart"></i></span>
                                        </a>
                                    </div>
                                </nav>
                            </div>
                            <div className="media-right">
                                <div className="buttons">
                                    {mediaLinkButton}

                                    {/* <div className="is-hidden-desktop">
                                        <Link href={linkUrl}>
                                            <a>
                                                <div className={buttonClassname}>
                                                    <i className="fas fa-search" color="blue"></i>
                                                </div>
                                            </a>
                                        </Link>
                                    </div> */}

                                    {mapLinkButtonMobile}
                                    {mapLinkButtonDesktop}
                                </div>
                            </div>
                            {imageModal}
                        </article>
                    );
                }}
            </Query>
        );
    }
}



Media.propTypes = {
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
    date: PropTypes.string
};

export default withApollo(Media);