import pandas as pd

storage: dict[str, pd.DataFrame] = {}
filenames: dict[str, str] = {}


def clean_numeric(df: pd.DataFrame) -> pd.DataFrame:
    """Turn text columns like '$1,200.50' into real numbers."""
    for c in df.select_dtypes(include="object").columns:
        non_null = df[c].notna().sum()
        if non_null == 0:
            continue
        converted = pd.to_numeric(
            df[c].astype(str).str.replace(r"[$€₹,\s]", "", regex=True),
            errors="coerce",
        )
        if converted.notna().sum() >= 0.8 * non_null:
            df[c] = converted
    return df