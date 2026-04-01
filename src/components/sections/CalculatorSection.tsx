"use client";
// src/components/sections/CalculatorSection.tsx
import { useState, useCallback } from "react";
import { calcEMI, calcFD, formatNPR, clamp } from "@/lib/utils";
import { interestRateTable } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./CalculatorSection.module.css";

export function CalculatorSection() {
  const { t } = useLanguage();
  const c = t.calc;

  const [mode, setMode] = useState<"emi" | "fd">("emi");

  // EMI state
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(24);

  // FD state
  const [fdAmount, setFdAmount] = useState(100000);
  const [fdRate, setFdRate] = useState(10);
  const [fdMonths, setFdMonths] = useState(12);

  const emi = useCallback(() => calcEMI(principal, rate, tenure), [principal, rate, tenure]);
  const fd = useCallback(() => calcFD(fdAmount, fdRate, fdMonths), [fdAmount, fdRate, fdMonths]);

  const emiResult = emi();
  const fdResult = fd();

  return (
    <section className={styles.section} id="calculator">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className="section-label">{c.label}</div>
            <h2 className="section-title">{c.title}</h2>
            <p className="section-subtitle">{c.subtitle}</p>

            <div className={styles.rateTable}>
              <div className={styles.rateTitle}>{c.currentRates}</div>
              <div className={styles.rateGrid}>
                <div>
                  <div className={styles.rateHead}>{c.depositsHead}</div>
                  {interestRateTable.deposits.slice(0, 4).map((r) => (
                    <div key={r.product} className={styles.rateRow}>
                      <span>{r.product}</span>
                      <span className={styles.rateVal}>{r.minRate === r.maxRate ? `${r.minRate}%` : `${r.minRate}–${r.maxRate}%`}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className={styles.rateHead}>{c.loansHead}</div>
                  {interestRateTable.loans.slice(0, 4).map((r) => (
                    <div key={r.product} className={styles.rateRow}>
                      <span>{r.product}</span>
                      <span className={styles.rateVal}>{r.minRate}%+</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className={styles.disclaimer}>{c.disclaimer}</p>
          </div>

          <div className={styles.right}>
            <div className={styles.modeTabs}>
              {(["emi", "fd"] as const).map((m) => (
                <button key={m} className={`${styles.modeTab} ${mode === m ? styles.modeActive : ""}`} onClick={() => setMode(m)}>
                  {m === "emi" ? c.tabEmi : c.tabFd}
                </button>
              ))}
            </div>

            {mode === "emi" ? (
              <div className={styles.form}>
                <SliderField label={c.loanAmount} value={principal} min={10000} max={10000000} step={10000} format={formatNPR} onChange={setPrincipal} />
                <SliderField label={c.interestRate} value={rate} min={8} max={24} step={0.5} format={(v) => `${v}%`} onChange={setRate} />
                <SliderField label={c.tenure} value={tenure} min={3} max={240} step={3} format={(v) => `${v} ${c.mo}`} onChange={setTenure} />

                <div className={styles.result}>
                  <ResultRow label={c.monthlyEmi} value={formatNPR(emiResult.emi)} accent />
                  <ResultRow label={c.totalInterest} value={formatNPR(emiResult.interest)} />
                  <ResultRow label={c.processingFee} value={formatNPR(emiResult.fee)} />
                  <ResultRow label={c.totalPayable} value={formatNPR(emiResult.total + emiResult.fee)} />
                </div>
              </div>
            ) : (
              <div className={styles.form}>
                <SliderField label={c.depositAmount} value={fdAmount} min={5000} max={5000000} step={5000} format={formatNPR} onChange={setFdAmount} />
                <SliderField label={c.interestRate} value={fdRate} min={6} max={14} step={0.5} format={(v) => `${v}%`} onChange={setFdRate} />
                <SliderField label={c.tenure} value={fdMonths} min={6} max={36} step={6} format={(v) => `${v} ${c.mo}`} onChange={setFdMonths} />

                <div className={styles.result}>
                  <ResultRow label={c.interestEarned} value={formatNPR(fdResult.interest)} accent />
                  <ResultRow label={c.maturityAmount} value={formatNPR(fdResult.maturity)} />
                  <ResultRow label={c.taxAt5} value={formatNPR(fdResult.tax)} />
                  <ResultRow label={c.netMaturity} value={formatNPR(fdResult.net)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderField({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <label className="form-label">{label}</label>
        <span className={styles.fieldVal}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
        className={styles.slider}
        aria-label={label}
      />
    </div>
  );
}

function ResultRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`${styles.resultRow} ${accent ? styles.resultAccent : ""}`}>
      <span>{label}</span>
      <span className={styles.resultVal}>{value}</span>
    </div>
  );
}
