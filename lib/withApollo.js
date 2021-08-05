import 'cross-fetch/polyfill'
import { withApollo } from "next-apollo"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "/api/graphql",
    credentials: "same-origin"
  }),
	cache: new InMemoryCache()
})

export default withApollo(apolloClient)
