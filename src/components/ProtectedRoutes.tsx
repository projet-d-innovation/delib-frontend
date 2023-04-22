import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  isSignedIn?: boolean;
  isAllowed?: boolean;
  redirectPath?: string;
  children?: React.ReactElement;
}

const ProtectedRoute = ({
  isSignedIn = true,
  isAllowed = true,
  redirectPath = '/not-allowed',
  children,
}: ProtectedRouteProps) => {

  if (!isSignedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;