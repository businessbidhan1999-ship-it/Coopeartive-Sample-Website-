'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Info } from 'lucide-react';
import { calcEMI, calcFD, formatNPR } from '@/lib/utils';

export function Calculator() {
  const [mode, setMode] = useState('loan');
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(36);
  const [amountText, setAmountText] = useState('500000');
  const loan = calcEMI(amount, rate, months);
  const deposit = calcFD(amount, rate, months);
  const changeMode = (value: string) => {
    setMode(value);
    setRate(value === 'loan' ? 12 : 8);
  };
  return (
    <div className="calculator">
      <div className="calculator-inputs">
        <div className="tabs calculator-tabs" role="group" aria-label="Calculator type">
          <button aria-pressed={mode === 'loan'} onClick={() => changeMode('loan')}>
            Loan repayment
          </button>
          <button aria-pressed={mode === 'deposit'} onClick={() => changeMode('deposit')}>
            Fixed deposit
          </button>
        </div>
        <label htmlFor="calc-amount">
          {mode === 'loan' ? 'Loan' : 'Deposit'} amount <span>NPR</span>
        </label>
        <input
          id="calc-amount"
          type="number"
          min="1000"
          max="10000000"
          step="1000"
          value={amountText}
          onChange={(e) => {
            setAmountText(e.target.value);
            const n = Number(e.target.value);
            if (n >= 1000 && n <= 10000000) setAmount(n);
          }}
          onBlur={() => {
            const n = Math.min(10000000, Math.max(1000, Number(amountText) || 1000));
            setAmount(n);
            setAmountText(String(n));
          }}
        />
        <div className="range-heading">
          <label htmlFor="calc-rate">Annual interest rate</label>
          <output htmlFor="calc-rate">{rate}%</output>
        </div>
        <input
          id="calc-rate"
          type="range"
          min="0"
          max="24"
          step="0.5"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <div className="range-limits">
          <span>0%</span>
          <span>24%</span>
        </div>
        <div className="range-heading">
          <label htmlFor="calc-months">{mode === 'loan' ? 'Repayment' : 'Deposit'} period</label>
          <output htmlFor="calc-months">{months} months</output>
        </div>
        <input
          id="calc-months"
          type="range"
          min="6"
          max="120"
          step="6"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
        />
        <div className="range-limits">
          <span>6 months</span>
          <span>10 years</span>
        </div>
      </div>
      <div className="calculator-result">
        <p>
          {mode === 'loan' ? 'Your estimated monthly payment' : 'Your estimated maturity amount'}
        </p>
        <strong className="result-amount">
          {formatNPR(mode === 'loan' ? loan.emi : deposit.maturity)}
        </strong>
        <div className="result-details">
          <div>
            <span>{mode === 'loan' ? 'Principal amount' : 'Original deposit'}</span>
            <strong>{formatNPR(amount)}</strong>
          </div>
          <div>
            <span>{mode === 'loan' ? 'Total interest' : 'Interest before tax'}</span>
            <strong>{formatNPR(mode === 'loan' ? loan.interest : deposit.interest)}</strong>
          </div>
          <div>
            <span>{mode === 'loan' ? 'Total repayment' : 'Deposit period'}</span>
            <strong>{mode === 'loan' ? formatNPR(loan.total) : `${months} months`}</strong>
          </div>
        </div>
        <Link className="text-link" href="/products#rates">
          Compare illustrative rates <ArrowUpRight size={16} />
        </Link>
        <p className="calculator-disclaimer">
          <Info size={15} />
          An illustration, not an offer.{' '}
          {mode === 'loan'
            ? 'Reducing-balance estimate; fees and insurance are excluded.'
            : 'Simple interest estimate; tax and fees are excluded.'}{' '}
          Actual terms depend on the provider.
        </p>
      </div>
    </div>
  );
}
