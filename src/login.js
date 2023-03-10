import React, { useState, useCallback, useRef, useEffect } from 'react';
import to from 'await-to-js';
import DeroBridgeApi from 'dero-rpc-bridge-api';
import { useNavigate } from 'react-router-dom' ;

const Login = () => {
  const navigate = useNavigate();
  const deroBridgeApiRef = useRef();
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initDeroBridge = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi();
      const deroBridgeApi = deroBridgeApiRef.current;
      const [err] = await to(deroBridgeApi.init());
      if (err) {
        setErrorMessage('Failed to connect to extension.');
      }
    };

    window.addEventListener('load', initDeroBridge);
    return () => window.removeEventListener('load', initDeroBridge);
  }, []);

  const getWalletAddress = useCallback(async (userAddress) => {
    const deroBridgeApi = deroBridgeApiRef.current;
    const [err, res] = await to(deroBridgeApi.wallet('get-address'));
    if (err) {
      setErrorMessage(err.message);
      return '';
    }
    return res;
  }, []);

  const handleLogin = async () => {
    const userAddress = address.trim();
    if (!userAddress) {
      setErrorMessage('Please enter your wallet address.');
      return;
    }
    const walletAddress = await getWalletAddress(userAddress);
    if (!walletAddress) {
      setErrorMessage('Failed to retrieve wallet address.');
      return;
    }
    if (userAddress === walletAddress) {
      // User authentication successful, allow access to account.
      // Do something here, like redirect to account page.
      navigate('./login');
    } else {
      setErrorMessage('Invalid wallet address.');
    }
  };

  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  return (
    <div>
      <p>hey</p>
      <label>
        Wallet Address:
        <input type="text" value={address} onChange={handleChange} />
      </label>
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;