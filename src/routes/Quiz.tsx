import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BUDGET_OPTIONS, METHOD_QUESTION, QUIZ, buildProfile } from '../lib/quiz'
import { useProfile } from '../lib/profile'
import type { BrewMethod } from '../lib/types'

/** Total steps = taste questions + brew methods + budget. */
const EXTRA_STEPS = 2

export default function Quiz() {
  const navigate = useNavigate()
  const { setProfile } = useProfile()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [methods, setMethods] = useState<BrewMethod[]>([])
  const [budget, setBudget] = useState<number | null>(null)

  const total = QUIZ.length + EXTRA_STEPS
  const isMethodStep = step === QUIZ.length
  const isBudgetStep = step === QUIZ.length + 1

  function answerAndAdvance(questionId: string, choiceIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }))
    setStep((s) => s + 1)
  }

  function toggleMethod(m: BrewMethod) {
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  }

  function finish(finalBudget: number) {
    setProfile(buildProfile(answers, methods, finalBudget))
    navigate('/you')
  }

  return (
    <div className="stack">
      <div className="progress">
        <div style={{ width: `${(step / total) * 100}%` }} />
      </div>

      <p className="meta">
        Question {Math.min(step + 1, total)} of {total}
      </p>

      {!isMethodStep && !isBudgetStep && (
        <div className="stack">
          <h1>{QUIZ[step].question}</h1>
          <div className="grid">
            {QUIZ[step].choices.map((choice, i) => (
              <button
                key={choice.label}
                className={`choice${answers[QUIZ[step].id] === i ? ' selected' : ''}`}
                onClick={() => answerAndAdvance(QUIZ[step].id, i)}
              >
                {choice.label}
                {choice.hint && <span className="hint">{choice.hint}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMethodStep && (
        <div className="stack">
          <h1>{METHOD_QUESTION.question}</h1>
          <p className="meta">
            This decides which grinders make sense for you. Leave it blank if you only drink
            coffee out.
          </p>
          <div className="chip-row">
            {METHOD_QUESTION.options.map((o) => (
              <button
                key={o.value}
                className={`chip${methods.includes(o.value) ? ' on' : ''}`}
                onClick={() => toggleMethod(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div>
            <button className="btn" onClick={() => setStep((s) => s + 1)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {isBudgetStep && (
        <div className="stack">
          <h1>What would you spend on a grinder?</h1>
          <p className="meta">
            Be honest rather than aspirational — you can always change it later.
          </p>
          <div className="grid">
            {BUDGET_OPTIONS.map((b) => (
              <button
                key={b.value}
                className={`choice${budget === b.value ? ' selected' : ''}`}
                onClick={() => {
                  setBudget(b.value)
                  finish(b.value)
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step > 0 && (
        <div>
          <button className="btn secondary" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </button>
        </div>
      )}
    </div>
  )
}
