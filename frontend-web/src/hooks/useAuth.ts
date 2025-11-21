import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, setLoading } from '../store/slices/authSlice';
import AuthService from '../services/auth.service';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const [stateLoading, setStateLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      setStateLoading(true);
      try {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) {
          if (mounted) {
            dispatch(setCredentials({ user: null as any, token: '' }));
          }
          return;
        }

        // set token header for api helper if you have setAuthToken
        if ((AuthService as any).setToken) {
          (AuthService as any).setToken(token);
        }

        // attempt to fetch current user
        const me = await AuthService.me();
        if (mounted) {
          dispatch(setCredentials({ user: me, token }));
        }
      } catch (err) {
        if (mounted) {
          dispatch(setCredentials({ user: null as any, token: '' }));
        }
      } finally {
        if (mounted) setStateLoading(false);
      }
    }

    check();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return { loading: stateLoading, isAuthenticated, user };
}