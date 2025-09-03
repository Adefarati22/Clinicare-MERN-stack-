import { AuthContext } from "./Index";
import { useState, useEffect } from "react";
import { getAuthenticatedUser, refreshAccessToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/component/LazyLoader";

export default function AuthProvider({ children }) {
  // set and save accessToken in state memory
  const [accessToken, setAccessToken] = useState(null); //the moment we save the accessToken, it will be available in the state memory
  const [user, setUser] = useState(null); //default value of user, when user is logged in we will set the user state to the user data

  // query to refresh access token on app start
  useQuery({
    queryKey: ["refresh_token"], // cache key for our api call
    queryFn: async () => {
      const res = await refreshAccessToken();
      // make api calls to get new accessToken, then update it in our own accessToken state using setAccessToken setter function
      if (res.status === 200) {
        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken); // update accessToken state
        return res;
      } else {
        setAccessToken(null); //if res,status is not 200, set accessToken to null or remove the accessToken and force a logout
        return null;
      }
    },
    enabled: !accessToken, // ensure it runs only when we don't have an accessToken, because that is when we need to refresh it
    retry: false, //don't run or retry this query if the queryFn fails
  });

  // fetching authenticated user data- 2 ways to use the useQuery hook either by destructuring the data or by using the data property
 //fetch auth user
  const { isPending, data } = useQuery({
    queryKey: ["auth_user", accessToken],
    queryFn: () => getAuthenticatedUser(accessToken),
    onError: async (error) => {
      console.error("Error fetching user", error);
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (data?.status === 200) {
      setUser(data?.data?.data);
    }
  }, [data?.data?.data, data?.status]);

  if (isPending && accessToken) {
    return <LazyLoader />; // show a loading spinner while we are authenticating the user
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
