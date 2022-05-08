import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Combobox as Listbox, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { findFlagUrlByIso3Code } from 'country-flags-svg';
import currenciesName from './currenciesName.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: false,
    title: false,
    tooltip: {
      mode: 'index',
      intersect: false,
      displayColors: false,
    },
  },
  elements: {
    point: {
      radius: 4,
    },
  },
  scales:
  {
    x: {
      grid: {
        lineWidth: 0,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 20,
      },
    },
    y: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
      },
    },
  },
  hover: {
    mode: 'index',
    intersect: false,
  },
};

function Graph() {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [chartData, setChartData] = useState({});
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('MYR');

  useEffect(() => {
    fetch('https://api.frankfurter.app/currencies').then((res) => res.json())
      .then((data) => setSupportedCurrencies(Object.keys(data)));
  }, []);

  useEffect(() => {
    fetch(`https://api.frankfurter.app/1999-01-04..?from=${fromCurrency}&to=${toCurrency}`).then((res) => res.json()).then((data) => {
      const d = Object.entries(data.rates).map(([k, v]) => [k, Object.values(v)[0]]);
      setChartData({
        labels: d.map(([k]) => new Date(k).toLocaleDateString('en-GB', {
          year: 'numeric',
        })),
        datasets: [
          {
            label: '',
            data: d.map(([, v]) => v),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: '#FFFFFF00',
            pointBorderColor: '#FFFFFF00',
            pointHoverBackgroundColor: 'rgb(59 130 246)',
            pointHoverBorderColor: 'rgb(59 130 246)',
            lineTension: 0.4,
          },
        ],
      });
    });
  }, [fromCurrency, toCurrency]);

  return (
    <div className="mt-6 h-full flex flex-col">
      <div className="flex gap-8">
        <div className="w-1/2">
          <Listbox value={fromCurrency} onChange={setFromCurrency}>
            <span className="text-xs text-zinc-400 font-medium">From</span>
            <div className="border-b-2 border-zinc-200 flex items-center pb-2">
              <Listbox.Button className="w-full flex items-center justify-between">
                <span>
                  {fromCurrency}
                  {' '}
                  -
                  {' '}
                  {currenciesName[fromCurrency][0]}
                </span>
                <div className="flex items-center">
                  <img src={findFlagUrlByIso3Code(currenciesName[fromCurrency][1])} alt="flag" className="w-6 h-min shadow-sm mr-2 rounded-sm" />
                  <Icon icon="uil:direction" className="w-6 h-6 text-zinc-400" />
                </div>
              </Listbox.Button>
            </div>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options className="text-sm max-h-64 overflow-y-auto mt-2 shadow-md bg-white rounded-md absolute left-0 bottom-0 translate-y-full w-full">
                {supportedCurrencies.map((name) => (
                  <Listbox.Option key={name} value={name} className="px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white font-medium">
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
                          {(currenciesName[name] || [])[0]}
                        </span>
                        {selected ? (
                          <span>
                            <Icon icon="uil:check" className="w-6 h-6" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
        <div className="w-1/2">
          <Listbox value={toCurrency} onChange={setToCurrency}>
            <span className="text-xs text-zinc-400 font-medium">To</span>
            <div className="border-b-2 border-zinc-200 flex items-center pb-2">
              <Listbox.Button className="w-full flex items-center justify-between">
                <span>
                  {toCurrency}
                  {' '}
                  -
                  {' '}
                  {currenciesName[toCurrency][0]}
                </span>
                <div className="flex items-center">
                  <img src={findFlagUrlByIso3Code(currenciesName[toCurrency][1])} alt="flag" className="w-6 h-min shadow-sm mr-2 rounded-sm" />
                  <Icon icon="uil:direction" className="w-6 h-6 text-zinc-400" />
                </div>
              </Listbox.Button>
            </div>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options className="text-sm max-h-64 overflow-y-auto mt-2 shadow-md bg-white rounded-md absolute left-0 bottom-0 translate-y-full w-full">
                {supportedCurrencies.map((name) => (
                  <Listbox.Option key={name} value={name} className="px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white font-medium">
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
                          {(currenciesName[name] || [])[0]}
                        </span>
                        {selected ? (
                          <span>
                            <Icon icon="uil:check" className="w-6 h-6" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
      </div>
      <div className="h-full mt-4">
        {JSON.stringify(chartData) !== '{}' && <Line options={options} data={chartData} height="100%" />}
      </div>
    </div>
  );
}

export default Graph;
