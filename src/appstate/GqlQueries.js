import { gql } from '@apollo/client';

export const TOP30_HASHTAGS_LAST7DAYS = gql`
query TOP30_HASHTAGS_LAST7DAYS {
  tophashtags: gcm_top30_hashtags_last_7_days(limit:30) {
      tag
      tagcount
  }
}
`

export const ALL_HASHTAGS_LAST7DAYS = gql`
query ALL_HASHTAGS_LAST7DAYS
{
  tophashtags: gcm_hashtags_last_7_days {
      tag
      message_id
      territory
  }
}
`

export const GEOMSGS_BY_HASHTAGS_LAST_14_DAYS = gql`
query GEOMSGS_BY_HASHTAGS_LAST_14_DAYS($tags: _text!){
    messages: gcm_geomsgs_by_hashtag_last_14_days(args: {tags: $tags}) {
        contributor_name
        message_id
        location
    }
}
`

export const GEOMSGS_LAST_14_DAYS = gql`
query GEOMSGS_LAST_14_DAYS($msglimit: Int!){
    messages: gcm_geomessages_last_14_days(limit: $msglimit) {
        contributor_name
        message_id
        location
    }
}
`


// export const GEOMSGS_BY_HASHTAGS = gql`
// query($tags: [String!], $msglimit: Int!){
//     tags: gcm_hashtags_last_14_days(where: {tag: {_in: $tags}}) {
//         tag
//         message_id
//         territory
//     }
//     messages: gcm_geomessages_last_14_days(limit: $msglimit) {
//         contributor_name
//         message_id
//         location
//     }
// }
// `

export const MSGS_BY_HASHTAGS_LAST_14_DAYS = gql`
query MSGS_BY_HASHTAGS_LAST_14_DAYS($tags: _text!){
    messages: gcm_msgs_by_hashtag_last_14_days(args: {tags: $tags}) {
        contributor_name
        message_id
        location
    }
}
`

export const MSGS_LAST_14_DAYS = gql`
query MSGS_LAST_14_DAYS($msglimit: Int!){
    messages: gcm_messages_last_14_days(limit: $msglimit) {
        contributor_name
        message_id
        location
    }
}
`
export const MSG_BY_ID_QUERY = gql`
query MSG_BY_ID_QUERY($messageid: String) {
    shared_links: gcm_shared_links(where: {message_id: {_eq: $messageid}}) {
        message_id
        url
        expanded_url
        source
        host
        location
        preview
    }
    messages: gcm_messages_last_14_days(where: {message_id: {_eq: $messageid}}) {
        harvest_id
        contributor_screen_name
        contributor_name
        https_contributor_profile_pic
        message
        message_id
        time
        like_count
        twitter_favorite_count
        twitter_favorite_count
        network
        location
    }
  }`

export const MSG_BY_ID_QUERY_LAST_14_DAYS = gql`
query MSG_BY_ID_QUERY_LAST_14_DAYS($messageid: String) {
    shared_links: gcm_shared_links(where: {message_id: {_eq: $messageid}}) {
        message_id
        url
        expanded_url
        source
        host
        location
        preview
    }
    messages: gcm_messages(where: {message_id: {_eq: $messageid}}) {
        harvest_id
        contributor_screen_name
        contributor_name
        https_contributor_profile_pic
        message
        message_id
        time
        like_count
        twitter_favorite_count
        twitter_favorite_count
        network
        location
    }
  }`
