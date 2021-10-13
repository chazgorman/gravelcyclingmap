import React from 'react';
import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { activeMessageIdVar, showMobileMapMode, showMobileMedia } from '../appstate/cache'
import { MSG_BY_ID_QUERY } from '../appstate/GqlQueries';

export default function MediaModalHeader({ messageid }) {
    const { loading, error, data, refetch, networkStatus } = useQuery(
      MSG_BY_ID_QUERY,
      {
        variables: { messageid },
        notifyOnNetworkStatusChange: true
        // pollInterval: 500
      }
    );

    const activeMessages = useReactiveVar(activeMessageIdVar);
     
    if (loading || networkStatus === 4) return <button className="button is-loading">Loading...</button>
    if (error) return <p>`Error!: ${error}`</p>

    var mediaLinkButton = undefined;
    var mediaImage = undefined; 

    var sharedLinks = data.shared_links;
    var message = null;
    var directLink = undefined;
    
    var closeModalFunc = () => {
        showMobileMapMode(false);
        showMobileMedia(false);
        activeMessageIdVar(activeMessages.filter(item => item !== messageid));
    };

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
            directLink = sharedLinks[0].url;
            mediaImage = sharedLinks[0].preview;
        }
        else {
            mediaLinkButton = (
                <div className="button">
                    <i className="far fa-image"></i>
                </div>
            )
            directLink = sharedLinks[0].url;
            mediaImage = sharedLinks[0].preview;
        }
    }

     var modalClassname = "modal is-hidden"
     if(activeMessages.includes(messageid)){
      modalClassname = "modal;"
    }

    return (
        <div className="modal-card ml-0">
            <header className="modal-card-head">
                <figure className="media-left">
                <p className="image is-48x48">
                    <img className="is-rounded" src={message.https_contributor_profile_pic} alt="Placeholder image" />
                </p>
                </figure>
                <div className="media-content">
                    <p><strong>{message.contributor_name}</strong></p>
                    <p><small>@{message.contributor_screen_name}</small></p>
                </div>
                <button className="delete is-large" aria-label="close" onClick={() => closeModalFunc()}></button>
            </header>
        </div>
    );
}