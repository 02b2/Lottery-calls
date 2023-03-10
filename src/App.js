import './App.css';
import to from 'await-to-js';
import DeroBridgeApi from 'dero-rpc-bridge-api';
import React from 'react';
import { useState, useCallback } from 'react';


function App() {

    const deroBridgeApiRef = React.useRef()
    const [bridgeInitText, setBridgeInitText] = React.useState('') // text that displays if connected to bridge
    const [rando, setRando] = React.useState(null)
    const [lotterygiveback, setlotterygiveback] = React.useState(null)
    const [lotteryeveryXdeposit, setlotteryeveryXdeposit] = React.useState(null)
    const [address, setAddress] = useState(null)


    React.useEffect(() => {
      const load = async () => {
        deroBridgeApiRef.current = new DeroBridgeApi()
        const deroBridgeApi = deroBridgeApiRef.current
        const [err] = await to(deroBridgeApi.init())
        if (err) {
          setBridgeInitText('failed to connect to extension')
        } else {
          setBridgeInitText('connected to extension')
        }
      }
  
      window.addEventListener('load', load)
      return () => window.removeEventListener('load', load)
    }, [])
  
    const UpdateRando = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
        scid:"aa5943a26940175eeea327d938d7febccaf0948a4a271d5b3dae15edeb95e190",
        ringsize:2,
        sc_rpc:[
          {
            name: "entrypoint",
            datatype: "S",
            value:"SetRandomInteger"
          }
        ]
      }))
    })

    const GetRando = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
        scid:"aa5943a26940175eeea327d938d7febccaf0948a4a271d5b3dae15edeb95e190",
        variables: true
      }))
      setRando(res.data.result.stringkeys.Rando)
    })

    const Getlotterygiveback = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
        scid:"d1c1ed28b9013b4b4fc5227adfaaac6d3a496763986311e2027f7d76662884ec",
        variables: true
      }))
      setlotterygiveback(res.data.result.stringkeys.lotterygiveback)
    })

    const GetlotteryeveryXdeposit = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
        scid:"d1c1ed28b9013b4b4fc5227adfaaac6d3a496763986311e2027f7d76662884ec",
        variables: true
      }))
      setlotteryeveryXdeposit(res.data.result.stringkeys.lotteryeveryXdeposit)
    })



    const withdraw = React.useCallback(async (event) => {
      event.preventDefault();
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
        "scid": event.target.scid.value,
        "ringsize": 2,
        "sc_rpc": [{
          "name": "entrypoint",
          "datatype": "S",
          "value": "Withdraw"
        },
          {
          "name": "asset",
          "datatype": "S",
          "value": event.target.asset.value
        },
        {
          "name": "amount",
          "datatype": "U",
          "value": parseInt(event.target.amount.value)
        }]
      }))

      
  
      console.log(err)
      console.log(res)
    }, [])
  

    const transferDERO = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
        transfers: [{
          destination: 'd1c1ed28b9013b4b4fc5227adfaaac6d3a496763986311e2027f7d76662884ec',
          amount: 100000,
        }]
      }))
  
      if (err) alert(err.message)
      else alert(JSON.stringify(res))
    }, [])
  
    const transferAsset = React.useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
        transfers: [{
          scid: '',
          destination: 'deto1qyg7mqwag7lch9267dttyrxy5jlc8tqwedtel77kpq0zh2zr7rvlsqgs2cz33',
          amount: 100000,
        }, {
          scid: 'd1c1ed28b9013b4b4fc5227adfaaac6d3a496763986311e2027f7d76662884ec',
          destination: '',
          burn: 1,
        }]
      }))
  
      if (err) alert(err.message)
      else alert(JSON.stringify(res))
    }, [])
  
    const getWalletAddress = useCallback(async () => {
      const deroBridgeApi = deroBridgeApiRef.current
      const [err, res] = await to(deroBridgeApi.wallet('get-address'))
      if (err) alert(err.message)
      else setAddress(res)
    }, [])
    
    
  return (
    <div className="App">
      <header className="App-header">
        <div className="function">
    <h3> Withdraw Funds </h3> 
    <form onSubmit={withdraw}>
      <p>SCID</p>
      <input id="scid" type="text" />
      <p>Asset</p>
      <input id="asset" type="text" />
      <p>Amount</p>
      <input id="amount" type="text" />
      <button type={"submit"}>Withdraw</button>
    </form>
 
    <h3> Trransfer DERO</h3>
    <form onSubmit={transferDERO}>
      <p>WalletAddress</p>
      <input id="walletaddress" type="text" />
      <p>Amount</p>
      <input id="amount" type="text" />
      <button type={"submit"}>Withdraw</button>
    </form>
    <h3>TransferAsset</h3>
    <form onSubmit={transferAsset}>
      <p>SCID</p>
      <input id="SCIDFrom" type="text" />
      <p>Wallet</p>
      <input id="DestinationToo" type="text" />
      <p>Amount</p>
      <input id="amountOut" type="text" />
      <p>SCID</p>
      <input id="SCIDToo" type="text" />
      <p>Wallet</p>
      <input id="walletaddress" type="text" />
      <button type={"submit"}>Transfer</button>
    </form>


  </div>
  
        <p>{rando}</p>
        <p>{lotterygiveback}</p>
        <p>{bridgeInitText}</p>
        <p>{lotteryeveryXdeposit}</p>
        <button onClick={getWalletAddress}>Get address</button>
      {address && <p>{JSON.stringify(address)}</p>}
        <button onClick={UpdateRando} >Set Random</button>
        <button onClick={GetRando} >GetRandom</button>
        <button onClick={Getlotterygiveback}>Lottery Give Back Total</button>
        <button onClick={GetlotteryeveryXdeposit} >lotteryeveryXdeposit</button>
        <button onClick={transferDERO}>Transfer DERO</button>
        <button onClick={transferAsset}>Transfer ASSET</button>
       
        
      </header>
    </div>
  );
}

export default App;
