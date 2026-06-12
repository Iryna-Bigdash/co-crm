'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ExchangeRate {
  currency: string;
  rate: number;
}

interface CurrencyRates {
  uahToUsd: number;
  uahToEur: number;
  usdToEur: number;
  lastUpdate: string;
}

export default function CurrencyRatesCard() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('UAH');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  // Fetch currency rates from PrivatBank API
  const { data: rates, isLoading } = useQuery<CurrencyRates>({
    queryKey: ['currency-rates'],
    queryFn: async () => {
      try {
        const response = await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5');
        const data = await response.json();
        
        const usd = data.find((rate: any) => rate.ccy === 'USD');
        const eur = data.find((rate: any) => rate.ccy === 'EUR');
        
        return {
          uahToUsd: parseFloat(usd?.buy || '0'),
          uahToEur: parseFloat(eur?.buy || '0'),
          usdToEur: eur && usd ? parseFloat(eur.buy) / parseFloat(usd.buy) : 0,
          lastUpdate: new Date().toLocaleString('uk-UA'),
        };
      } catch (error) {
        console.error('Error fetching rates:', error);
        return {
          uahToUsd: 41.5,
          uahToEur: 45.0,
          usdToEur: 1.08,
          lastUpdate: new Date().toLocaleString('uk-UA'),
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Update every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!rates || !amount) return;

    const numAmount = parseFloat(amount) || 0;
    let result = 0;

    if (fromCurrency === toCurrency) {
      result = numAmount;
    } else if (fromCurrency === 'UAH' && toCurrency === 'USD') {
      result = numAmount / rates.uahToUsd;
    } else if (fromCurrency === 'UAH' && toCurrency === 'EUR') {
      result = numAmount / rates.uahToEur;
    } else if (fromCurrency === 'USD' && toCurrency === 'UAH') {
      result = numAmount * rates.uahToUsd;
    } else if (fromCurrency === 'USD' && toCurrency === 'EUR') {
      result = numAmount * rates.usdToEur;
    } else if (fromCurrency === 'EUR' && toCurrency === 'UAH') {
      result = numAmount * rates.uahToEur;
    } else if (fromCurrency === 'EUR' && toCurrency === 'USD') {
      result = numAmount / rates.usdToEur;
    }

    setConvertedAmount(result);
  }, [amount, fromCurrency, toCurrency, rates]);

  if (isLoading) {
    return <div className="p-4">Loading currency rates...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Currency Rates Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4 transition-colors">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">UAH → USD</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {rates?.uahToUsd.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 USD = {rates?.uahToUsd.toFixed(2)} UAH</div>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4 transition-colors">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">UAH → EUR</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {rates?.uahToEur.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 EUR = {rates?.uahToEur.toFixed(2)} UAH</div>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg p-4 transition-colors">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">USD → EUR</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {rates?.usdToEur.toFixed(4)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 USD = {rates?.usdToEur.toFixed(4)} EUR</div>
        </div>
      </div>

      {/* Currency Calculator */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Currency Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 h-11 rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="Enter amount"
                step="0.01"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="h-11 rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Converted to
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={convertedAmount.toFixed(2)}
                readOnly
                className="flex-1 h-11 rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold transition-colors"
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="h-11 rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              const temp = fromCurrency;
              setFromCurrency(toCurrency);
              setToCurrency(temp);
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            ⇄ Swap currencies
          </button>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
        Last updated: {rates?.lastUpdate}
      </div>
    </div>
  );
}
