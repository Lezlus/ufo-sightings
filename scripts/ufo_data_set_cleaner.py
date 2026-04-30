from pathlib import Path

import pandas as pd

DATA_FOLDER_PATH = Path(__file__).resolve().parent / "data"
UNCLEANED_DATA_FILE_PATH = DATA_FOLDER_PATH / "nuforc_reports.csv"
CLEANED_DATA_FILE_PATH = DATA_FOLDER_PATH / "alien_sightings_cleaned.csv"
# There are 16,112 null values for latitude and longitude. We need these rows dropped 
def main():
    df = pd.read_csv(UNCLEANED_DATA_FILE_PATH)
    df_cleaned = df.dropna()
    
    df_cleaned.to_csv(CLEANED_DATA_FILE_PATH, mode='w', index=False)
if __name__ == '__main__':
    main()