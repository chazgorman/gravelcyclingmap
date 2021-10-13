import { useReactiveVar } from '@apollo/client';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { activeMessageIdVar, showFilterModalVar, selectedTopicsVar } from '../appstate/cache'

export default function TabMenu() {
    const router = useRouter()
    const activeMessages = useReactiveVar(activeMessageIdVar); // Is there a message selected?
    const selectedTopics = useReactiveVar(selectedTopicsVar);

    var componentClassName = "tabs is-small is-hidden-desktop is-toggle is-centered is-fullwidth";
    var geoTaggedLinkClass = "navbar-item is-link is-light";
    var mediaLinkClass = "navbar-item is-link is-light";
    var filterLinkClass = "navbar-item is-link is-light";

    if (activeMessages.length > 0) {
        componentClassName = componentClassName + " is-hidden";
    }

    if (router !== null && router.pathname == "/media") {
        mediaLinkClass = mediaLinkClass + " is-active";
    }
    else {
        geoTaggedLinkClass = geoTaggedLinkClass + " is-active";
    }

    if(selectedTopics !== null && selectedTopics.length > 0){
        filterLinkClass = filterLinkClass + " is-active";
    }

    return (
        <div className={componentClassName}>
            <ul>
                <Link href="/">
                    <a className={geoTaggedLinkClass}>
                        <span className="icon"><i className="fas fa-globe" /></span>
                        <span>Geo-Tagged</span>
                    </a>
                </Link>
                <Link href="/media">
                    <a className={mediaLinkClass}>
                        <span className="icon"><i className="fas fa-image" /></span>
                        <span>All Posts</span>
                    </a>
                </Link>
                <a className={filterLinkClass} onClick={() => showFilterModalVar(true)}>
                    <span className="icon"><i className="fas fa-filter" /></span>
                    <span>Filter</span>
                </a>
            </ul>
        </div>
    );
}