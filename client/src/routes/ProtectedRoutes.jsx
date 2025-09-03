import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export function PublicRoutes({ children, accessToken }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/dashboard";

  useEffect(() => {
    if (accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
  }, [accessToken, from, location, navigate]);
  return children;
  //here we are simply saying that if the user is authenticated (has an access token), we want to redirect them to the page they were trying to access before logging in, the authentication page will not show after they have logged because they are already authenticated.
  //the useLocation is used to get the current location, and the useNavigate is used to navigate to a different page.
}

export function PrivateRoutes({ children, accessToken, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/account/signin";

  useEffect(() => {
    if (!accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
     if (user && !user.isVerified && location.pathname !== "/Verify-account") {
      navigate("/Verify-account");
    }
    if (
      user &&
      user?.isVerified &&
      user?.role === "patient" &&
      !user?.isCompletedOnboard &&
      location.pathname !== "/patient-onboard"
    ) {
      navigate("/patient-onboard", {
        state: { from: location },
        replace: true,
      });
    }
  }, [accessToken, from, location, navigate, user]);
  return children;
}

//here we are simply saying that if the user is not authenticated (does not have an access token), we want to redirect them to the sign-in page, and if he has logged in but not verified we want to redirect them to the verify-page

//the PrivateRoutes component is used to protect the routes that require authentication while the PublicRoutes component is used to protect the routes that do not require authentication.

export function VerifiedRoutes({ children, accessToken, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "account/signin";

  useEffect(() => {
    if (!accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
    //handle redirection for unverified users to verify account
    if (user && !user.isVerified && location.pathname !== "/Verify-account") {
      navigate("/Verify-account");
    }
  }, [accessToken, from, location, navigate, user]);
  return children;
}
//here we are saying if we have a user and is not verified and is not on the verify-account path we want to redirect them to the verify-account page
