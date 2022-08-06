import React, {useEffect, useState} from 'react';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {Reorder} from 'framer-motion';
import CryptoPriceModel from './models/Crypto';

function App() {
  const [hubConnection, setHubConnection]=useState<HubConnection>();
  const [cryptoPriceTrackingList, setCryptoPriceTrackingList] = useState<CryptoPriceModel[]>([])
  useEffect(() => {
    createHubConnection();
  }, [])

  useEffect(() => {
    if(hubConnection) {
      hubConnection.on('ReceiveCryptoPriceInformationList', (crypto: CryptoPriceModel[]) => {
        var sortedData = crypto.sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
        setCryptoPriceTrackingList(sortedData)
        })
    }
  }, [hubConnection])


  const createHubConnection = async () => {
    const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:7216/cryptoPriceTrackingHub", {skipNegotiation: true, transport: HttpTransportType.WebSockets}).build();
    setHubConnection(hubConnection);
    try {
      await hubConnection.start();
      await hubConnection.invoke("GetCryptoPriceInformationList").catch((err) => { console.log(err)});
    }catch (e) {
      console.log("error", e);
    }
  }


  return (
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold text-center leading-tight">Kripto Fiyat Takip Listesi</h2>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div
                className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
            >
              <Reorder.Group values={cryptoPriceTrackingList} onReorder={setCryptoPriceTrackingList}>
                <table className="min-w-full leading-normal">
                  <thead>
                  <tr>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Kripto Cinsi
                    </th>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Fiyat
                    </th>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      24 Saatteki Fiyat Değişimi
                    </th>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Trend
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {cryptoPriceTrackingList.map(cryptoPrice =>
                      <Reorder.Item as='tr' key={cryptoPrice.priceChangePercent} value={parseFloat(cryptoPrice.priceChangePercent)}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                  className="w-full h-full rounded-full"
                                  src={`https://assets.coincap.io/assets/icons/${cryptoPrice.name}@2x.png`}
                                  alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {cryptoPrice.symbol}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{cryptoPrice.lastPrice} $</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-600 whitespace-no-wrap">{cryptoPrice.priceChangePercent} %</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {parseFloat(cryptoPrice.priceChangePercent) > 0 ? (      <span
                              className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                          >
                  <span
                      aria-hidden
                      className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                  ></span>
                  <span className="relative">Yükseliş Trendi</span>
                </span>) :       <span
                              className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight"
                          >
                  <span
                      aria-hidden
                      className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                  ></span>
                  <span className="relative">Düşüş Trendi</span>
                </span> }
                        </td>
                      </Reorder.Item>)}

                  </tbody>
                </table>
              </Reorder.Group>

            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
