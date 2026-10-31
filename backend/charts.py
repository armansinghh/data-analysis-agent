import io
import base64

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams.update({
    "figure.facecolor": "#121216", "axes.facecolor": "#121216",
    "axes.edgecolor": "#26262E", "axes.labelcolor": "#9494A0",
    "text.color": "#F4F4F6", "xtick.color": "#9494A0", "ytick.color": "#9494A0",
    "grid.color": "#1A1A20", "grid.linestyle": "--", "figure.dpi": 150,
})


def to_base64(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()


def bar_chart(series, title: str) -> str:
    fig, ax = plt.subplots(figsize=(6, 3.5))
    series.plot(kind="bar", ax=ax, color="#6366F1")
    ax.set_title(title, fontsize=10)
    ax.grid(axis="y")
    plt.xticks(rotation=30, ha="right")
    return to_base64(fig)


def hist_chart(values, title: str) -> str:
    fig, ax = plt.subplots(figsize=(6, 3.5))
    ax.hist(values.dropna(), bins=10, color="#6366F1")
    ax.set_title(title, fontsize=10)
    ax.grid(axis="y")
    return to_base64(fig)