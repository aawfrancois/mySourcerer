import gql from "graphql-tag";

export const GET_USER = gql`
    query {
        viewer {
            login
            email
            avatarUrl
            bio
            url
            followers {
                totalCount
            }
            following {
                totalCount
            }
        }
        search(query: "user:aawfrancois fork:true is:public", type: REPOSITORY) {
            repositoryCount
        }
    }
`;


export const GET_REPOSITORIES = gql`
    query {
        user(login: "aawfrancois") {
            login
            repositories(first: 30, privacy: PUBLIC) {
                totalCount
                nodes {
                    name
                    primaryLanguage {
                        name
                        color
                    }
                    defaultBranchRef {
                        target {
                            ... on Commit {
                                history {
                                    totalCount
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`

