import React, { useState } from 'react';
import ConversionRateList from './components/ConversionRateList';
import Converter from './components/Converter';

function App() {
  const [fromCurrencies, setFromCurrencies] = useState([]);
  const [isRateListOpen, setRateListOpen] = useState(false);

  return (
    <div className="w-screen h-screen relative overflow-hidden flex bg-zinc-50 text-zinc-800 font-[Inter]">
      <Converter
        fromCurrencies={fromCurrencies}
        setFromCurrencies={setFromCurrencies}
        setRateListOpen={setRateListOpen}
      />
      <ConversionRateList
        fromCurrencies={fromCurrencies}
        isRateListOpen={isRateListOpen}
        setRateListOpen={setRateListOpen}
      />
    </div>
  );
}

export default App;
