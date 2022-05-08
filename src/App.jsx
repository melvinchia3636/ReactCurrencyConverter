import React, { useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { findFlagUrlByIso3Code } from 'country-flags-svg';
import CurrencyInput from 'react-currency-input-field';
import currenciesName from './currenciesName.json';
import Graph from './Graph';

function App() {
  const [fromCurrencies, setFromCurrencies] = useState([]);
  const [toCurrencies, setToCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('MYR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fromCurrencyQuery, setFromCurrencyQuery] = useState('');
  const [toCurrencyQuery, setToCurrencyQuery] = useState('');
  const [rateListCurrencyQuery, setRateListCurrencyQuery] = useState('');
  const [fromCurrencyAmount, setFromCurrencyAmount] = useState(0);
  const [toCurrencyAmount, setToCurrencyAmount] = useState(0);
  const [rateListCurrency, setRateListCurrency] = useState('USD');
  const [rateList, setRateList] = useState([]);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD').then((res) => res.json()).then((data) => {
      setFromCurrencies(Object.entries(data.rates));
      setLastUpdated(new Date(data.time_last_update_unix * 1000).toDateString());
    });
  }, []);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setToCurrency(fromCurrency === 'USD' ? 'MYR' : 'USD');
    }
    fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`).then((res) => res.json()).then((data) => {
      setToCurrencies(Object.entries(data.rates).filter((e) => e[0] !== fromCurrency));
    });
  }, [fromCurrency]);

  useEffect(() => {
    if (toCurrency) {
      setToCurrencyAmount(parseFloat(fromCurrencyAmount)
        * Object.fromEntries(toCurrencies)[toCurrency]);
    }
  }, [toCurrency, fromCurrencyAmount, toCurrencies]);

  useEffect(() => {
    fetch(`https://open.er-api.com/v6/latest/${rateListCurrency}`).then((res) => res.json()).then((data) => {
      setRateList(Object.entries(data.rates));
    });
  }, [rateListCurrency]);

  const filteredFromCurrencies = fromCurrencyQuery === ''
    ? fromCurrencies
    : fromCurrencies.filter(([name]) => name.toLowerCase().includes(fromCurrencyQuery.toLowerCase())
    || currenciesName[name][0]?.toLowerCase().includes(fromCurrencyQuery.toLowerCase()));

  const filteredToCurrencies = toCurrencyQuery === ''
    ? toCurrencies
    : toCurrencies.filter(([name]) => name.toLowerCase().includes(toCurrencyQuery.toLowerCase())
    || currenciesName[name][0]?.toLowerCase().includes(toCurrencyQuery.toLowerCase()));

  const filteredRateListCurrencies = rateListCurrencyQuery === ''
    ? fromCurrencies
    : fromCurrencies
      .filter(([name]) => name.toLowerCase().includes(rateListCurrencyQuery.toLowerCase())
    || currenciesName[name][0]?.toLowerCase().includes(rateListCurrencyQuery.toLowerCase()));

  return (
    <div className="w-full h-screen flex bg-zinc-50 text-zinc-800 font-[Inter]">
      <div className="h-full flex-1 flex flex-col overflow-y-auto">
        <div className="p-16 pt-10 flex flex-col h-full relative">
          <h1 className="w-min whitespace-nowrap text-4xl font-medium">Currency Converter</h1>
          <p className="ml-0.5 mt-1 text-sm text-zinc-400 font-medium">
            Last updated:
            {' '}
            {lastUpdated || 'N/A'}
          </p>
          <div className="mt-12 flex justify-between gap-8">
            <div className="w-1/2">
              <div className="relative">
                <Combobox value={fromCurrency} onChange={setFromCurrency}>
                  <span className="text-xs text-zinc-400 font-medium">From</span>
                  <div className="w-full border-b-2 border-zinc-200 flex items-center pb-2">
                    <Combobox.Input className="focus:outline-none w-full font-medium bg-transparent" onChange={(event) => setFromCurrencyQuery(event.target.value)} displayValue={(value) => `${value} - ${currenciesName[value][0]}`} />
                    <img src={findFlagUrlByIso3Code(currenciesName[fromCurrency][1])} alt="flag" className="w-6 h-auto shadow-sm mr-2 rounded-sm" />
                    <Combobox.Button>
                      <Icon icon="uil:direction" className="w-6 h-6 text-zinc-400" />
                    </Combobox.Button>
                  </div>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Combobox.Options className="max-h-96 overflow-y-auto mt-2 shadow-md bg-white rounded-md absolute left-0 bottom-0 translate-y-full w-full">
                      {filteredFromCurrencies.map(([name]) => (
                        <Combobox.Option key={name} value={name} className="text-sm px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white font-medium">
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {name}
                                {' '}
                                -
                                {' '}
                                {currenciesName[name][0]}
                              </span>
                              {selected ? (
                                <span>
                                  <Icon icon="uil:check" className="w-6 h-6" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Transition>
                </Combobox>
              </div>
              <div className="flex w-full mt-8">
                <CurrencyInput
                  className="bg-transparent text-5xl w-full font-light focus:outline-none"
                  decimalsLimit={2}
                  decimalScale={2}
                  value={fromCurrencyAmount}
                  prefix={currenciesName[fromCurrency][2]}
                  onValueChange={(value) => setFromCurrencyAmount(value || 0.0)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFromCurrency(toCurrency);
                setFromCurrencyQuery(toCurrencyQuery);
                setToCurrencyQuery(fromCurrencyQuery);
                setToCurrency(fromCurrency);
              }}
              className="rounded-md flex-shrink-0 shadow-md bg-blue-500 focus:outline-none flex items-center justify-center w-14 h-14 mt-0.5"
            >
              <Icon icon="ph:shuffle-bold" className="text-white w-6 h-6" />
            </button>
            <div className="w-1/2">
              <div className="relative">
                <Combobox value={toCurrency} onChange={setToCurrency}>
                  <span className="text-xs text-zinc-400 font-medium">To</span>
                  <div className="w-full border-b-2 border-zinc-200 flex items-center pb-2">
                    <Combobox.Input className="focus:outline-none w-full font-medium bg-transparent" onChange={(event) => setToCurrencyQuery(event.target.value)} displayValue={(value) => `${value} - ${currenciesName[value][0]}`} />
                    <img src={findFlagUrlByIso3Code(currenciesName[toCurrency][1])} alt="flag" className="w-6 h-auto shadow-sm mr-2 rounded-sm" />
                    <Combobox.Button>
                      <Icon icon="uil:direction" className="w-6 h-6 text-zinc-400" />
                    </Combobox.Button>
                  </div>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Combobox.Options className="max-h-96 overflow-y-auto mt-2 shadow-md bg-white rounded-md absolute left-0 bottom-0 translate-y-full w-full">
                      {filteredToCurrencies.map(([name]) => (
                        <Combobox.Option key={name} value={name} className="text-sm px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white font-medium">
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {name}
                                {' '}
                                -
                                {' '}
                                {currenciesName[name][0]}
                              </span>
                              {selected ? (
                                <span>
                                  <Icon icon="uil:check" className="w-6 h-6" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Transition>
                </Combobox>
              </div>
              <div className="flex w-full mt-8">
                <CurrencyInput
                  className="bg-transparent text-5xl w-full font-light focus:outline-none"
                  decimalsLimit={2}
                  decimalScale={2}
                  value={toCurrencyAmount}
                  prefix={currenciesName[toCurrency][2]}
                  disabled
                />
              </div>
            </div>
          </div>
          <Graph />
          <div className="text-xs text-zinc-500 absolute left-1/2 bottom-2 -translate-x-1/2 font-medium">Made with 💖 by Melvin Chia. Project under MIT license.</div>
        </div>
      </div>
      <div className="h-full w-3/12 bg-white shadow-md p-8 pb-0 flex flex-col">
        <h2 className="text-2xl font-medium">Conversion Rates</h2>
        <div className="relative mt-4">
          <Combobox value={rateListCurrency} onChange={setRateListCurrency}>
            <span className="text-xs text-zinc-400 font-medium">Currency</span>
            <div className="w-full border-b-2 border-zinc-200 flex items-center pb-2">
              <Combobox.Input className="focus:outline-none w-full font-medium bg-transparent" onChange={(event) => setRateListCurrencyQuery(event.target.value)} displayValue={(value) => `${value} - ${currenciesName[value][0]}`} />
              <img src={findFlagUrlByIso3Code(currenciesName[rateListCurrency][1])} alt="flag" className="w-6 h-auto shadow-sm mr-2 rounded-sm" />
              <Combobox.Button>
                <Icon icon="uil:direction" className="w-6 h-6 text-zinc-400" />
              </Combobox.Button>
            </div>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Combobox.Options className="max-h-96 overflow-y-auto mt-2 shadow-md bg-white rounded-md absolute left-0 bottom-0 translate-y-full w-full">
                {filteredRateListCurrencies.map(([name]) => (
                  <Combobox.Option key={name} value={name} className="text-sm px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white font-medium">
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {name}
                          {' '}
                          -
                          {' '}
                          {currenciesName[name][0]}
                        </span>
                        {selected ? (
                          <span>
                            <Icon icon="uil:check" className="w-6 h-6" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </Combobox>
        </div>
        <div className="w-full h-full no-scrollbar mt-1 flex flex-col divide-y overflow-y-auto">
          {rateList.map(([name, rate]) => (
            <div key={name} className="flex items-center justify-between py-3 px-1">
              <span className="text-sm text-zinc-400 font-medium flex items-center">
                <img src={findFlagUrlByIso3Code(currenciesName[name][1])} alt="" className="w-5 h-auto shadow-sm mr-2 rounded-sm" />
                {name}
              </span>
              <span className="text-sm text-zinc-400 font-medium">
                {currenciesName[name][2]}
                {rate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
