import React from 'react';
import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { showFilterModalVar, selectedTopicsVar } from '../appstate/cache'
import { TOP30_HASHTAGS_LAST7DAYS } from '../appstate/GqlQueries';

export default function HashtagModal() {
    const showFilterModal = useReactiveVar(showFilterModalVar);
    const selectedTopics = useReactiveVar(selectedTopicsVar);
    const { loading, error, data, refetch, networkStatus } = useQuery(TOP30_HASHTAGS_LAST7DAYS);
      
    if (loading || networkStatus === 4) return <button className="button is-loading">Loading...</button>
    if (error) return <p>`Error!: ${error}`</p>

    let i = 0;
    var selectedTags = selectedTopics.map(hashtag => {
        return (
            <div key={i++} className="control">
                <div className="tags has-addons">
                    <a className="tag is-success">#{hashtag}</a>
                    <a className="tag is-delete" onClick={() => selectedTopicsVar(selectedTopics.filter(tag => tag !== hashtag))}></a>
                </div>
            </div>
        )
    });

    let j = 0;
    var unselectedHashtags = data.tophashtags.filter(item => !selectedTopics.includes(item.tag));

    var unselectedTags = unselectedHashtags.map(hashtag => {
        return (
            <div key={i++} className="control">
                <a className="tag is-link" onClick={() => selectedTopicsVar([...selectedTopics,hashtag.tag])}>#{hashtag.tag}</a>
            </div>        
        )
    });

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Filter Topics</p>
                    <button className="delete" aria-label="close" onClick={() => showFilterModalVar(!showFilterModal)}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field box is-grouped is-grouped-multiline">
                        {selectedTags}
                    </div>
                    <div className="field box is-grouped is-grouped-multiline">
                        {unselectedTags}
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" aria-label="close" onClick={() => showFilterModalVar(!showFilterModal)}>Close</button>
                    <button className="button" onClick={() => selectedTopicsVar([])}>Clear All</button>
                </footer>
            </div>
        </div>
    );
}