
import { client } from "./apollo";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "./context/auth.context";
import { AppNavigator } from "./navigators/RootNavigator";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ApolloProvider>
  );
}
