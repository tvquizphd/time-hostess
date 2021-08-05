import { ApolloServer, gql } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const typeDefs = gql`
  type Feeling {
    score: Float!
  }
  type Query {
    feeling(text: String!): Feeling!
  }
`

const resolvers = {
  Query: {
    feeling: (parent, args, context) => {
      return {
        score: 0.5,
      }
    },
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
})

const startServer = apolloServer.start()

export default async function handler(req, res) {

  await startServer
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
};
