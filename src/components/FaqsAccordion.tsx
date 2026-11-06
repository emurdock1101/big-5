import React from 'react';
import {faqs, Faq} from '../constants/content';

/** FAQs as native disclosure rows: keyboard and screen-reader friendly with no script. */
export default function FaqsAccordion() {
  return (
    <ul className='pp pp-faq'>
      {faqs.map((q: Faq, i: number) => (
        <li key={q.title}>
          <details open={i === 0}>
            <summary>{q.title}</summary>
            <div className='pp-body'>
              {[q.part1, q.part2, q.part3].filter(Boolean).map((p) => (
                <p key={p}>{p}</p>
              ))}
              {q.sources && (
                <ul className='pp-cites pp-small'>
                  {q.sources.map((src) => (
                    <li key={src}>{src}</li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
