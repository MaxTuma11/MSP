import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

INPUT_FILE = BASE_DIR / "src/data/publicwhip/mp_stats.json"
OUTPUT_FILE = BASE_DIR / "src/data/publicwhip/party_averages.json"


def load_json(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_percent(value):
    if not value:
        return None
    value = value.strip().lower()
    if value in {"n/a", "na", "none"}:
        return None
    try:
        return float(value.replace("%", ""))
    except ValueError:
        return None


def compute_averages(json_data):
    party_data = {}
    all_attendance = []
    all_rebellion = []

    for mp in json_data:
        party = mp.get("party")
        if not party or party == "Independent":
            continue

        attendance = parse_percent(mp.get("attendance_rate"))
        rebellion = parse_percent(mp.get("rebellion_rate"))

        if party not in party_data:
            party_data[party] = {
                "attendance": [],
                "rebellion": [],
                "mp_count": 0,
            }

        party_data[party]["mp_count"] += 1

        if attendance is not None:
            party_data[party]["attendance"].append(attendance)
            all_attendance.append(attendance)

        if rebellion is not None:
            party_data[party]["rebellion"].append(rebellion)
            all_rebellion.append(rebellion)

    stats = {}

    for party, data in party_data.items():
        stats[party] = {
            "mp_count": data["mp_count"],
            "average_attendance_rate": (
                sum(data["attendance"]) / len(data["attendance"])
                if data["attendance"] else 0
            ),
            "max_attendance_rate": max(data["attendance"], default=0),
            "min_attendance_rate": min(data["attendance"], default=0),
            "average_rebellion_rate": (
                sum(data["rebellion"]) / len(data["rebellion"])
                if data["rebellion"] else 0
            ),
            "max_rebellion_rate": max(data["rebellion"], default=0),
            "min_rebellion_rate": min(data["rebellion"], default=0),
        }

    #Sinn Féin abstentionism (explicit, documented exception)
    stats["Sinn Féin"] = {
        "mp_count": 7,
        "average_attendance_rate": 0,
        "max_attendance_rate": 0,
        "min_attendance_rate": 0,
        "average_rebellion_rate": 0,
        "max_rebellion_rate": 0,
        "min_rebellion_rate": 0,
    }

    overall_attendance = (
        sum(all_attendance) / len(all_attendance) if all_attendance else 0
    )
    overall_rebellion = (
        sum(all_rebellion) / len(all_rebellion) if all_rebellion else 0
    )

    return {
        "party_statistics": stats,
        "overall_average_attendance_rate": overall_attendance,
        "overall_average_rebellion_rate": overall_rebellion,
    }


def save_json(data, output_file):
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def main():
    data = load_json(INPUT_FILE)
    averages = compute_averages(data)
    save_json(averages, OUTPUT_FILE)
    print(f"Party averages written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
