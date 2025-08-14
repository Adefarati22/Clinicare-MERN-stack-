import { AuthContext } from "./Index";
import { useState } from "react";
import { getAuthenticatedUser, refreshAccessToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/component/LazyLoader";

export default function AuthProvider({ children }) {
  // set and save accessToken in state memory
  const [accessToken, setAccessToken] = useState(null); //the moment we save the accessToken, it will be available in the state memory
  const [user, setUser] = useState(null); //default value of user, when user is logged in we will set the user state to the user data
  const [isAuthenticating, setIsAuthenticating] = useState(false); //to check if we are authenticating the user

  // query to refresh access token on app start
  useQuery({
    queryKey: ["refresh_token"], // cache key for our api call
    queryFn: async () => {
      setIsAuthenticating(true); //we want to show a loading spinner while we are refreshing the access token or authenticating our user
      const res = await refreshAccessToken();
      // make api calls to get new accessToken, then update it in our own accessToken state using setAccessToken setter function
      if (res.status === 200) {
        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken); // update accessToken state
        setIsAuthenticating(false); // set isAuthenticating to false bcs we have gotten our accessToken
        return res;
      } else {
        setAccessToken(null); //if res,status is not 200, set accessToken to null or remove the accessToken and force a logout
        setIsAuthenticating(false);
        return null;
      }
    },
    enabled: !accessToken, // ensure it runs only when we don't have an accessToken, because that is when we need to refresh it
    retry: false, //don't run or retry this query if the queryFn fails
  });

  // fetching authenticated user data- 2 ways to use the useQuery hook either by destructuring the data or by using the data property
  useQuery({
    queryKey: ["auth_user"], //cache key for our api call, it prevents multiple api calls and also helps us to cache the data and its done automatically
    queryFn: async () => {
      setIsAuthenticating(true); //for when we are trying to authenticate to true
      //this is the function that will be called to fetch the data, normally we will use the useEffect hook for this but with react-query we can use the useQuery hook to fetch data
      const res = await getAuthenticatedUser(accessToken);
      if(res.status === 200) {
        setUser(res.data?.data); //hold the value from  our res in user state
        setIsAuthenticating(false); //set isAuthenticating to false bcs we have gotten our user
        return res;
      }
      setIsAuthenticating(false)
      return null; //if res is not 200, return null
    },
    onError: (error) => {
      console.error("Error fetching user", error);
    },
    enabled: !!accessToken, //runs only when we have an accessToken, this is to prevent the query from running when we don't have an accessToken
  });
  console.log(user);
  console.log(accessToken);

  if (isAuthenticating) {
    return <LazyLoader />; // show a loading spinner while we are authenticating the user
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
