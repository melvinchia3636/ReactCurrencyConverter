/* eslint-disable react/prop-types */
import { Combobox, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { findFlagUrlByIso3Code } from 'country-flags-svg';
import React, { useEffect, useState } from 'react';
import currenciesName from '../currenciesName.json';

function ConversionRateList({ fromCurrencies, isRateListOpen, setRateListOpen }) {
  const [rateListCurrencyQuery, setRateListCurrencyQuery] = useState('');
  const [rateListCurrency, setRateListCurrency] = useState('USD');
  const [rateList, setRateList] = useState([]);

  useEffect(() => {
    fetch(`https://open.er-api.com/v6/latest/${rateListCurrency}`).then((res) => res.json()).then((data) => {
      setRateList(Object.entries(data.rates));
    });
  }, [rateListCurrency]);

  const filteredRateListCurrencies = rateListCurrencyQuery === ''
    ? fromCurrencies
    : fromCurrencies
      .filter(([name]) => name.toLowerCase().includes(rateListCurrencyQuery.toLowerCase())
    || currenciesName[name][0]?.toLowerCase().includes(rateListCurrencyQuery.toLowerCase()));

  return (
    <div className={`h-full absolute top-0 z-20 ${
      isRateListOpen ? 'left-0' : 'left-full'
    } lg:static w-full lg:w-3/12 bg-white shadow-md p-8 pb-0 flex flex-col transition-all duration-500`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Conversion Rates</h2>
        <button
          type="button"
          className="text-zinc-500 hover:text-zinc-700 focus:outline-none lg:hidden"
          onClick={() => setRateListOpen(false)}
        >
          <Icon icon="uil:times" className="w-7 h-7" />
        </button>
      </div>
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
      <div className="w-full h-full no-scrollbar mt-1 flex flex-col divide-y overflow-y-auto pb-8">
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
  );
}

export default ConversionRateList;
