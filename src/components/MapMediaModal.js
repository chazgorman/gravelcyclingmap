import React from 'react';
import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { activeMessageIdVar, showMobileMapMode } from '../appstate/cache'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { MSG_BY_ID_QUERY } from '../appstate/GqlQueries';

export default function MapMediaModal({ messageid }) {
    const { loading, error, data, refetch, networkStatus } = useQuery(
      MSG_BY_ID_QUERY,
      {
        variables: { messageid },
        notifyOnNetworkStatusChange: true
        // pollInterval: 5000
      }
    );

    const activeMessages = useReactiveVar(activeMessageIdVar);
  
    // In case Media Modal has been requested from a map 'click', set the message ID and refetch data.
    if(data === undefined){
        messageid = activeMessages[0];
        refetch();
    }

    if (loading || networkStatus === 4) return <button className="button is-loading">Loading...</button>
    if (error) return <p>`Error!: ${error}`</p>

    //var mediaData = data.shared_links[0]
    var retweetLink = "https://twitter.com/intent/retweet?tweet_id=" + messageid;
    var replyToLink = "https://twitter.com/intent/tweet?in_reply_to=" + messageid;
    var likeLink = "https://twitter.com/intent/like?tweet_id=" + messageid;

    var mediaLinkButton = undefined;
    var mediaImage = undefined; 

    if(data != undefined){
        var sharedLinks = data.shared_links;
    }
    var message = null;
    var directLink = undefined;
    
    var modalBody = undefined;

    var closeModalFunc = () => {
        showMobileMapMode(false);
        activeMessageIdVar(activeMessages.filter(item => item !== messageid));
    };

    if(data !== undefined && data.messages != undefined && data.messages.length > 0){
        message = data.messages[0]
    }

    
    if (data !== undefined && sharedLinks !== undefined && sharedLinks.length > 0) {
        var mediaUrl = sharedLinks[0].expanded_url;

        if (mediaUrl.startsWith("https://www.instagram.com")) {
            mediaLinkButton = (
                <div className="button" onClick={() => activeMessageIdVar([messageid])}>
                    <i className="fab fa-instagram"></i>
                </div>
            )
            directLink = sharedLinks[0].url;
            mediaImage = sharedLinks[0].preview;

            modalBody = (
                <section className="modal-card-body">
                    <section>
                    <div className="image is-2by2">
                            <a href={directLink} target="_blank" title="View on Instagram."><img src={mediaImage} alt="View on Instagram" /></a>
                        </div>
                        <div>
                            <p className="mt-1 has-text-info-dark">{message.message}</p>
                            <a href={directLink} target="_blank"><p className="is-italic has-text-right has-text-link-dark">View on Instagram</p></a>
                        </div>
                    </section>
                </section>
            );
        }
        else {
            mediaLinkButton = (
                <div className="button">
                    <i className="far fa-image"></i>
                </div>
            )
            directLink = sharedLinks[0].url;
            mediaImage = sharedLinks[0].preview;

            modalBody = (
                <section className="modal-card-body">
                    <section>
                        <TwitterTweetEmbed key={messageid} tweetId={messageid} placeholder="Loading Tweet..."/>
                    </section>
                </section>
            );
        }
    }

     var modalClassname = "modal is-hidden"
     if(activeMessages.includes(messageid)){
      modalClassname = "modal;"
    }

    // var timeStamp = message.time;
    // var dateString = new Date(timeStamp.replace(' ', 'T')).toDateString();

    return (
        <div className={modalClassname}>
            <div className="modal-background"></div>
            <div className="modal-card ml-0">
                <header className="modal-card-head pt-2 pb-2">

                    {/* <p className="modal-card-title">Modal title</p> */}
                    <figure className="media-left">
                        <p className="image is-48x48">
                            <img className="is-rounded" src={message.https_contributor_profile_pic} alt="Placeholder image" />
                        </p>
                    </figure>
                    <div className="media-content">
                        <p><strong>{message.contributor_name}</strong></p>
                        <p><small>@{message.contributor_screen_name}</small></p>
                    </div>
                    <div className="media-content is-hidden-desktop" onClick={() => showMobileMapMode(true)}>
                        <div className="button is-link"><i className="fas fa-globe" color="blue"></i></div>
                    </div>
                    <button className="delete is-large" aria-label="close" onClick={() => closeModalFunc()}></button>
                </header>
                {modalBody}
            </div>
        </div>
    );
}