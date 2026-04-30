from pathlib import Path

import pandas as pd

DATA_FOLDER_PATH = Path(__file__).resolve().parent / "data"
CLEANED_DATA_FILE_PATH = DATA_FOLDER_PATH / "alien_sightings_cleaned.csv"

columns = ["summary", "city","state","date_time","shape","duration","stats","report_link","text","posted","city_latitude","city_longitude"]

try:
    df = pd.read_csv(CLEANED_DATA_FILE_PATH)
except pd.errors.ParserError as e:
    print(f"Data inconsistency found: {e}")
