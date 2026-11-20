# Data Analysis Agent
Upload a CSV, ask questions in plain english, get an answer with a chart. runs fully on your machine, and checks its own output before showing it to you.

![Demo](./assets/hero-img.jpg)

## What is it
analysing a csv usually means knowing pandas, sql or excel formulas, and most people (students, faculty, anyone non-dev) don't. so i'm building a tool where you just upload your attendance sheet / marks sheet / survey data and ask "which students are below 75% attendance?" like you'd ask a person.

**two things make it different from julius ai / chatgpt's data analysis:** <br>
1. **it runs locally** - your data never leaves your laptop. every similar tool I found sends your file to some server. if it's student marks or survey responses, that's not great.
2. **it doesn't blindly trust the LLM** - LLMs confidently run the wrong operation and show a nice looking chart, and you'd never know it's wrong. before showing anything, this checks if the analysis it ran actually answers what you asked. if not, it flags it or asks you to clarify (this is the part i care about most).

## Features
1. upload any csv (attendance, marks, event registrations, surveys etc.)
2. ask questions in plain english, no code or formulas
3. answers come back as text + a chart
4. every answer comes with the pandas operation that ran (backend sends it, showing it in the ui is next)
5. asks you to clarify when a question could mean more than one column, instead of guessing
6. hallucination check before output is displayed (planned, sem 4)
7. open source, runs on your machine

> [!NOTE]
> not all of this is built yet, check the status section below for what actually works right now

## Tech Stack
| Tool | Role | Why |
| --- | --- | --- |
| Python + Pandas | data processing | standard for this, best documented |
| FastAPI | backend | cleaner and faster than flask |
| Matplotlib | charts | clean + well documented (plotly maybe in v2) |
| Next.js + TypeScript + Tailwind | frontend | separate from the backend so each can be built and tested on its own |
| LangChain + BERT (HuggingFace) | question understanding | planned for sem 4, free and runs locally |

## How it works
```
upload csv -> type question -> parse the question (keywords for now)
-> pandas runs the analysis -> matplotlib draws the chart -> next.js shows it
```

right now the question parsing is simple keyword matching (finds average / total / max / min / count, then matches your words to column names). langchain + bert replace it in sem 4, and the hallucination detector goes between "pandas runs" and "shows it" (the interesting bit, not built yet).

## Run it locally
backend (from the `backend/` folder):

```bash
pip install "fastapi[standard]" pandas matplotlib
fastapi dev main.py
```

frontend (from the `frontend/` folder, in another terminal):

```bash
npm install
npm run dev
```

open `http://localhost:3000`. backend docs are at `http://127.0.0.1:8000/docs`.

## Status
**in progress (sem 3 done, sem 4 next).** what works right now:
- `GET /health` - checks the server is up
- `POST /upload` - takes a csv (rejects bad files), cleans numeric columns like "$1,200", returns file id + filename + rows + columns
- `GET /info/{file_id}` - filename, rows, columns of an uploaded file
- `POST /query/{file_id}` - average / total / max / min / count, optional group by, asks when a question is ambiguous, returns answer + chart + the pandas op
- next.js upload page and chat page

**still to build:** showing the pandas op in the ui, filters / top-n questions, saving datasets (they live in memory and vanish when the server restarts), langchain + bert, hallucination detection layer.

## QnA

### why local and not just use chatgpt?
because the data is often sensitive (student marks, attendance, survey responses) and cloud tools upload it to their servers. running locally means nothing leaves your machine. also commercial tools are black boxes, here you can see every step.

### why bert and not a bigger LLM?
free, runs on a normal laptop, and for understanding *intent* (what kind of question is this?) it's good enough. no api keys or cost either.

## Credits
built by [Arman Singh](https://github.com/armansinghh) & [Arunya Mishra](https://github.com/arunyaya).