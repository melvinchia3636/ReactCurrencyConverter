import { useState, useEffect } from "react";
import { Combobox, Transition } from '@headlessui/react'
import { Icon } from "@iconify/react";
import currenciesName from "./currenciesName.json";
import { findFlagUrlByIso3Code } from 'country-flags-svg';

function App() {
  const [fromCurrencies, setFromCurrencies] = useState([]);
  const [toCurrencies, setToCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("MYR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [lastUpdated, setLastUpdated] = useState(null)
  const [fromCurrencyQuery, setFromCurrencyQuery] = useState("")
  const [toCurrencyQuery, setToCurrencyQuery] = useState("")

  useEffect(() => {
    fetch(`https://open.er-api.com/v6/latest/USD`).then(res => res.json()).then(data => {
      setFromCurrencies(Object.entries(data.rates))
      setLastUpdated(new Date(data.time_last_update_unix*1000).toDateString())
    })
  }, [])

  useEffect(() => {
    fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`).then(res => res.json()).then(data => {
      setToCurrencies(Object.entries(data.rates).filter(e => e[0] !== fromCurrency))
    })
  }, [fromCurrencies])


  const filteredFromCurrencies =
    fromCurrencyQuery === ''
      ? fromCurrencies
      : fromCurrencies.filter(([name]) => {
        return name.toLowerCase().includes(fromCurrencyQuery.toLowerCase()) || currenciesName[name][0]?.toLowerCase().includes(fromCurrencyQuery.toLowerCase())
      })

  const filteredToCurrencies =
    toCurrencyQuery === ''
      ? toCurrencies
      : toCurrencies.filter(([name]) => {
        return name.toLowerCase().includes(toCurrencyQuery.toLowerCase()) || currenciesName[name][0]?.toLowerCase().includes(toCurrencyQuery.toLowerCase())
      })

  return (
    <div className="w-full h-screen flex bg-slate-50 text-slate-800 font-[Inter]">
      <div className="h-full flex-1 p-24">
        <h1 className="w-min whitespace-nowrap text-4xl font-bold">Currency Converter</h1>
        <p className="ml-0.5 mt-1 text-sm text-slate-400 font-medium">Last updated: {lastUpdated || "N/A"}</p>
        <div className="mt-16 flex justify-between gap-8">
          <div className="flex-1">
            <Combobox value={fromCurrency} onChange={setFromCurrency}>
              <span className="text-xs text-slate-400 font-medium">From</span>
              <div className="w-full border-b-2 flex items-center pb-2">
                <Combobox.Input className="focus:outline-none w-full font-medium bg-transparent" onChange={(event) => setFromCurrencyQuery(event.target.value)} displayValue={(value) => `${value} - ${currenciesName[value][0]}`} />
                <img src={findFlagUrlByIso3Code(currenciesName[fromCurrency][1])} alt="flag" className="w-6 h-auto shadow-sm mr-2 rounded-sm" />
                <Combobox.Button>
                  <Icon icon="uil:direction" className="w-6 h-6 text-slate-400" />
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
                <Combobox.Options className="max-h-96 overflow-y-auto mt-2 shadow-md bg-white rounded-md">
                  {filteredFromCurrencies.map(([name]) => (
                    <Combobox.Option key={name} value={name} className="px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white font-medium">
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {name} - {currenciesName[name][0]}
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
          <button onClick={() => {
            setFromCurrency(toCurrency)
            setFromCurrencyQuery(toCurrencyQuery)
            setToCurrencyQuery(fromCurrencyQuery)
            setToCurrency(fromCurrency)
          }} className="rounded-md shadow-md bg-blue-500 focus:outline-none flex items-center justify-center w-14 h-14 mt-0.5">
            <Icon icon="gg:arrows-exchange" className="text-white w-6 h-6" />
          </button>
          <div className="flex-1">
            <Combobox value={toCurrency} onChange={setToCurrency}>
              <span className="text-xs text-slate-400 font-medium">To</span>
              <div className="w-full border-b-2 flex items-center pb-2">
                <Combobox.Input className="focus:outline-none w-full font-medium bg-transparent" onChange={(event) => setToCurrencyQuery(event.target.value)} displayValue={(value) => `${value} - ${currenciesName[value][0]}`} />
                <img src={findFlagUrlByIso3Code(currenciesName[toCurrency][1])} alt="flag" className="w-6 h-auto shadow-sm mr-2 rounded-sm" />
                <Combobox.Button>
                  <Icon icon="uil:direction" className="w-6 h-6 text-slate-400" />
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
                <Combobox.Options className="max-h-96 overflow-y-auto mt-2 shadow-md bg-white rounded-md">
                  {filteredToCurrencies.map(([name]) => (
                    <Combobox.Option key={name} value={name} className="px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white font-medium">
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {name} - {currenciesName[name][0]}
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
        </div>
      </div>
      <div className="h-full w-3/12 bg-blue-500"></div>
    </div>
  )
}

export default App
