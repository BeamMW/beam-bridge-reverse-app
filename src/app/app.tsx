import React, { useEffect } from 'react';
import { ROUTES } from '@app/shared/constants';
import { navigate as navigateAction } from '@app/shared/store/actions';
import { selectRouterLink } from '@app/shared/store/selectors';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate, useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { MainContainer } from './containers/Main';
import { ToastContainer } from 'react-toastify';

import './styles';

const routes = [
  {
    path: '/',
    element: <></>,
  },
  {
    path: `${ROUTES.MAIN.BASE}/*`,
    element: <MainContainer />,
  }
];

const App = () => {
  const dispatch = useDispatch();
  const content = useRoutes(routes);
  const navigate = useNavigate();
  const navigateURL = useSelector(selectRouterLink());

  useEffect(() => {
    if (navigateURL) {
      navigate(navigateURL);
      dispatch(navigateAction(''));
    }
  }, [navigateURL, dispatch, navigate]);

  return (
    <div>
      {content}
      <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          closeButton={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          icon={false}
          toastStyle={{
            textAlign: 'center',
            background: '#22536C',
            color: 'white',
            width: '90%',
            margin: '0 auto 36px',
            borderRadius: '10px',
          }}
        />
    </div>
  );
};

export default App;
