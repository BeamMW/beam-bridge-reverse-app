import React, { useEffect } from 'react';
import { ROUTES } from '@app/shared/constants';
import { css } from '@linaria/core';

import { actions as sharedActions, selectors as sharedSelectors } from '@app/shared/store';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate, useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { MainContainer } from './containers/Main';
import { ToastContainer } from 'react-toastify';
import { Scrollbars } from 'react-custom-scrollbars';
import { ethers } from "ethers";

import './styles';

const trackStyle = css`
  z-index: 999;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.2);
`;

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

async function estimateGas() {
  // Set up the EtherscanProvider
  const provider = new ethers.providers.EtherscanProvider("homestead", "XKWU88XG5Z8ESF5KNKJNDH4VFZUWFUJD5N");

  // Define the transaction
  const tx = {
    to: "0x959257a565d5Fb44724Bc322e83CAF8c8AaB3E8b", // Replace with the recipient's address
    value: ethers.utils.parseEther("0.1"), // Replace with the amount of ETH to send
    data: "0x", // Optional data payload
  };

  try {
    // Estimate gas
    const gasEstimate = await provider.estimateGas(tx);
    alert(`Estimated Gas: ${gasEstimate.toString()}`);
  } catch (error) {
    console.error("Error estimating gas:", error);
  }
}


const App = () => {
  const dispatch = useDispatch();
  const content = useRoutes(routes);
  const navigate = useNavigate();
  const navigateURL = useSelector(sharedSelectors.selectRouterLink());

  useEffect(() => {
    if (navigateURL) {
      navigate(navigateURL);
      dispatch(sharedActions.navigate(''));
    }
  }, [navigateURL, dispatch, navigate]);

  useEffect(() => {
    estimateGas();
  })
  
  return (
    <Scrollbars
        renderThumbVertical={(props) => <div {...props} className={trackStyle} />}
      >
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
    </Scrollbars>
  );
};

export default App;
