import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { activeMessageIdVar } from '../appstate/cache'
import { MSG_BY_ID_QUERY } from '../appstate/GqlQueries';

export default function Media({ messageid }) {
    const { loading, error, data, refetch, networkStatus } = useQuery(
      MSG_BY_ID_QUERY,
      {
        variables: { messageid },
        notifyOnNetworkStatusChange: true
        // pollInterval: 500
      }
    );
  
    if (loading || networkStatus === 4) return <button className="button is-loading">Loading...</button>
    if (error) return <p>`Error!: ${error}`</p>

    //var mediaData = data.shared_links[0]
    var retweetLink = "https://twitter.com/intent/retweet?tweet_id=" + messageid;
    var replyToLink = "https://twitter.com/intent/tweet?in_reply_to=" + messageid;
    var likeLink = "https://twitter.com/intent/like?tweet_id=" + messageid;

    var mediaLinkButton = undefined;

    var sharedLinks = data.shared_links;
    var message = null;

    if(data.messages != undefined && data.messages.length > 0){
        message = data.messages[0]
    }

    if (sharedLinks !== undefined && sharedLinks.length > 0) {
        var mediaUrl = sharedLinks[0].expanded_url;

        if (mediaUrl.startsWith("https://www.instagram.com")) {
            mediaLinkButton = (
                <div className="button" onClick={() => activeMessageIdVar([messageid])}>
                    <i className="fab fa-instagram"></i>
                </div>
            )
        }
        else {
            mediaLinkButton = (
                <div className="button" onClick={() => activeMessageIdVar([messageid])}>
                    <i className="far fa-image"></i>
                </div>
            )
        }
    }

    var timeStamp = message.time;
    var dateString = new Date(timeStamp.replace(' ', 'T')).toDateString();

    return (
        <article className="media" onClick={() => activeMessageIdVar([messageid])} data-mediaid={messageid}>
            <figure className="media-left">
                <p className="image is-48x48">
                    <img className="is-rounded" src={message.https_contributor_profile_pic} alt="Placeholder image" />
                </p>
            </figure>
            <div className="media-content">
                <div className="content">
                    <p>
                        <strong>{message.contributor_name}</strong> <small>{message.contributor_screen_name}</small> <small>{dateString}</small>
                        <br />
                        {message.message}
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
                </div>
            </div>                            
        </article>
    );
}