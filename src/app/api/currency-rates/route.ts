import { NextResponse } from 'next/server';

const PRIVATBANK_URL =
  'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';

interface PrivatBankRate {
  ccy: string;
  buy: string;
}

export async function GET() {
  try {
    const response = await fetch(PRIVATBANK_URL, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`PrivatBank API responded with ${response.status}`);
    }

    const data: PrivatBankRate[] = await response.json();
    const usd = data.find((rate) => rate.ccy === 'USD');
    const eur = data.find((rate) => rate.ccy === 'EUR');

    const uahToUsd = parseFloat(usd?.buy || '0');
    const uahToEur = parseFloat(eur?.buy || '0');

    return NextResponse.json({
      uahToUsd,
      uahToEur,
      usdToEur: uahToUsd && uahToEur ? uahToEur / uahToUsd : 0,
      lastUpdate: new Date().toLocaleString('uk-UA'),
    });
  } catch (error) {
    console.error('Error fetching currency rates:', error);

    return NextResponse.json(
      {
        uahToUsd: 41.5,
        uahToEur: 45.0,
        usdToEur: 1.08,
        lastUpdate: new Date().toLocaleString('uk-UA'),
        fallback: true,
      },
      { status: 200 },
    );
  }
}
