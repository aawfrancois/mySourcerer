import React, {Component} from "react";
import ApolloClient from "apollo-boost";
import {ApolloProvider, Query} from "react-apollo";
import {Doughnut} from "react-chartjs-2";

import {GET_USER, GET_REPOSITORIES} from "./requete.js";
import "./App.css";


const client = new ApolloClient({
    uri: "https://api.github.com/graphql",
    request: operation => {
        operation.setContext(context => ({
            headers: {
                ...context.headers,
                authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
            }
        }));
    }
});

const User = () => (
    <Query query={GET_USER}>
        {({loading, error, data}) => {
            if (loading) {
                return <span>loading...</span>;
            }

            return (
                <div>
                    <img width={32} height={32} alt="profile" src={data.viewer.avatarUrl}/>
                    <h1 className="App-user">{data.viewer.login}</h1>
                    <p>Repositories : {data.search.repositoryCount}</p>
                    <p>Followings : {data.viewer.following.totalCount}</p><p>Followers
                    : {data.viewer.followers.totalCount}</p>
                </div>
            );
        }}
    </Query>
);

const Repos = () => (
    <Query query={GET_REPOSITORIES}>
        {({loading, error, data}) => {
            if (loading) {
                return <span>loading...</span>;
            }
            const {nodes: repos} = data.user.repositories;
            const langueName = [];
            const langueColor = [];


            var newArrayLang;
            var newArrayColor;
            return (
                <div>

                    {repos.map((project) => {

                        if (project.primaryLanguage) {
                            langueName.push(project.primaryLanguage.name)
                            langueColor.push(project.primaryLanguage.color)
                        }

                    })}
                    {newArrayLang = ([...new Set(langueName)])}
                    {newArrayColor = ([...new Set(langueColor)])}


                    <Doughnut data={{
                        labels: [newArrayLang[1],
                            newArrayLang[2],
                            newArrayLang[3],
                            newArrayLang[4],
                            newArrayLang[5]],
                        datasets: [{
                            data: [300, 50, 100, 50, 100],
                            backgroundColor:[newArrayColor[1],
                                newArrayColor[2],
                                newArrayColor[3],
                                newArrayColor[4],
                                newArrayColor[5],]
                        }]

                    }}/>
                </div>
            );
        }}
    </Query>
);


class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <div className="App">
                    <header className="App-header">MY sourcerer like</header>
                    <User/>
                    <Repos/>
                    <div className="sidebar">

                    </div>
                </div>
            </ApolloProvider>
        );
    }
}

export default App;
