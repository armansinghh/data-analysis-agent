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
3. answers come back as a direct answer or a chart
4. shows what pandas operation actually ran, nothing hidden
5. hallucination check before output is displayed
6. open source, runs offline once set up

> [!NOTE]
> not all of this is built yet, check the status section below for what actually works right now

## Tech Stack
| Tool | Role | Why |
| --- | --- | --- |
| Python + Pandas | data processing | standard for this, best documented |
| LangChain | turns the question into a data operation | abstracts the annoying parts |
| BERT (HuggingFace) | understanding what the user actually wants | free, runs locally, good enough here |
| Matplotlib + Seaborn | charts | clean + well documented (plotly maybe in v2) |
| FastAPI | backend | cleaner and faster than flask |
| Streamlit | UI | working interface fast, no frontend overhead |

## How it works
```
upload csv -> type question -> LangChain interprets it -> BERT figures out intent
-> Pandas runs the analysis -> Matplotlib/Seaborn draws it
-> hallucination detector verifies -> Streamlit shows it
```

the verification step is the interesting bit. most NL-to-data tools treat the LLM output as ground truth - this one doesn't. it compares what was asked vs what was actually computed, and only then shows the result. no standard benchmark exists for this yet, so figuring out how to evaluate it is part of the project too.

## Run it locally
what's runnable right now is just the backend:

```bash
pip install fastapi uvicorn pandas python-multipart
uvicorn main:app --reload
```

then open `http://127.0.0.1:8000/docs` to try the endpoints.

## Status
**in progress (sem 3 part).** right now there's a FastAPI backend with:
- `GET /health` - checks the server is up
- `POST /upload` - takes a csv, returns filename + rows + columns

**still to build:** streamlit UI, NL querying, charts, langchain + bert integration, hallucination detection layer.

## QnA

### why local and not just use chatgpt?
because the data is often sensitive (student marks, attendance, survey responses) and cloud tools upload it to their servers. running locally means nothing leaves your machine. also commercial tools are black boxes, here you can see every step.

### why bert and not a bigger LLM?
free, runs on a normal laptop, and for understanding *intent* (what kind of question is this?) it's good enough. no api keys or cost either.

## Credits
built by [Arman Singh](https://github.com/armansinghh) & [Arunya Mishra](https://github.com/arunyaya).