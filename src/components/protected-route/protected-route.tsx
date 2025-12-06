import { selectIsAuthChecked, selectUser } from '@/services/user/reducer';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.ReactElement;
  //   isAuthenticated: boolean;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  const state = location.state as LocationState | null;

  if (!isAuthChecked) {
    return (
      <div>Loading ...</div>
      //Заменить
    );
  }

  if (!onlyUnAuth && !user) {
    //for authenticated users, but not logged in
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = state?.from?.pathname ?? '/';
    return <Navigate to={from} />;
  }

  // onlyUnAuth && !user, for unauthenticated users and not logged in
  // !onlyUnAuth && user, for authenticated users and logged in
  return component;
};
