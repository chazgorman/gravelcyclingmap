import React from 'react';
import EsriModalMap from './modalmap'
import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { activeMessageIdVar, showMobileMapMode } from '../appstate/cache'
import { MSG_BY_ID_QUERY} from '../appstate/GqlQueries'

export default function SideMedia({ messageid }) {
    const { loading, error, data, refetch, networkStatus } = useQuery(
        MSG_BY_ID_QUERY,
      {
        variables: { messageid },
        notifyOnNetworkStatusChange: true
        // pollInterval: 500
      }
    );
    
    const activeMessages = useReactiveVar(activeMessageIdVar);
    const showMap = useReactiveVar(showMobileMapMode);
  
    if (loading || networkStatus === 4) return <button className="button is-loading">Loading...</button>
    if (error) return <p>`Error!: ${error}`</p>

    var buttonClassname = "button is-link is-hidden-desktop is-small";
    if (showMap) {
        buttonClassname += " is-loading is-small";
    } else {
        buttonClassname += "is-success is-outlined is-small";
    }

    var directLink = undefined;
    var mediaImage = undefined; 

    var sharedLinks = data.shared_links;
    var message = null;

    if(data.messages != undefined && data.messages.length > 0){
        message = data.messages[0]
    }

    var sharedLinks = data.shared_links;

    if (sharedLinks !== undefined && sharedLinks.length > 0) {
        var mediaUrl = sharedLinks[0].expanded_url;

        if (mediaUrl.startsWith("https://www.instagram.com")) {
            directLink = sharedLinks[0].url;
            mediaImage = sharedLinks[0].preview;
        }
        else {
            directLink = sharedLinks[0].url;

            mediaImage = sharedLinks[0].source;
        }
    }

    var mobileMapButtonGroup = (<div className="buttons">
        <div className={buttonClassname} onClick={() => showMobileMapMode(true)}>
            <i className="fas fa-globe is-small" color="blue"></i>
        </div>
        <button className="delete is-small" aria-label="close" onClick={() => activeMessageIdVar(activeMessages.filter(item => item !== messageid))}></button>
    </div>)

    var mediaModal = undefined;
    if (showMap) {
        var map = (<EsriModalMap containerId={messageid} geometry={message.location} />);
        mediaModal = (
            <article className="message is-small">
                <div className="message-header">
                    <p>@{message.contributor_screen_name}</p>
                    {mobileMapButtonGroup}
                </div>
                <section className="message-body">
                    <div id={messageid} style={{ height: "60vh" }}></div>
                    <div>
                        <p>{message.message}</p>
                    </div>
                </section>
                {map}
            </article>
        );
    }
    else {
        mediaModal = (
            <article className="message is-small">
                <div className="message-header">
                    <p>@{message.contributor_screen_name}</p>
                    {mobileMapButtonGroup}
                </div>
                <section className="message-body">
                    <div className="image is-2by2">
                        <a href={directLink} target="_blank" title="Click image to view on Instagram."><img src={mediaImage} alt="View on Instagram"/></a>
                    </div>
                    <div>
                        <p>{message.message}</p>
                    </div>
                </section>
            </article>
        );
    }


    return (
        <article className="media">
            {mediaModal}
        </article>
    );
}