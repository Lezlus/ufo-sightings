import csv
import json
import os
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
UFO_GEO_JSON_FILE = SCRIPT_DIR / "data" / "ufoGeoJson.json"
UFO_CSV_FILE = SCRIPT_DIR / "data" / "alien_sightings_cleaned.csv"

def load_mapping(file_path: str):
    if os.path.exists(file_path):
        with open(file_path, 'r') as f_handle:
            return json.load(f_handle)
    return {}


def save_mapping(key: str, value: str, mapping: dict[str, str], file_path: str):
    """
    Adds a key:value pair to a JSON file
    """
    mapping[key] = value
    with open(file_path, 'w') as f_handle:
        json.dump(mapping, f_handle, indent=4)


def main():
    geo_json_data = load_mapping(UFO_GEO_JSON_FILE)

    with open(UFO_CSV_FILE, 'r', encoding='utf-8') as csv_file:
        reader = csv.reader(csv_file)
        count = 0
        for row in reader:
            if not count:
                count += 1
                continue
            lon = round(float(row[11]), 4)
            lat = round(float(row[10]), 4)
            geo_json_data["features"].append({
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        lon,
                        lat
                    ]
                },
                "type": "Feature",
                "properties": {
                    "id": count,
                    "c": row[1],
                    "s": row[2],
                    "dt": row[3],
                    "du": row[5],
                    "t": row[8],
                }
            })
            count += 1

    with open(UFO_GEO_JSON_FILE, 'w') as f_handle:
        json.dump(geo_json_data, f_handle, indent=4)
    print("Done")

if __name__ == "__main__":
    main()