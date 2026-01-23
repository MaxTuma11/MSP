import json

def load_json(file_path):
    with open(file_path, "r", encoding="utf-8") as json_file:
        return json.load(json_file)
    
def compute_averages(json_data):
    party_data = {}
    all_attendance_rates = []
    all_rebellion_rates = []

    for mp in json_data:
        party = mp["party"]

        if party == "Independent":
            continue

        attendance = float(mp["attendance_rate"].strip("%")) if mp["attendance_rate"] != "n/a" else None
        rebellion = float(mp["rebellion_rate"].strip("%")) if mp["rebellion_rate"] != "n/a" else None

        if party not in party_data:
            party_data[party] = {"attendance": [], "rebellion": [], "mp_count": 0}

        party_data[party]["mp_count"] += 1 
        
        if attendance is not None:
            party_data[party]["attendance"].append(attendance)
            all_attendance_rates.append(attendance)
        if rebellion is not None:
            party_data[party]["rebellion"].append(rebellion)
            all_rebellion_rates.append(rebellion)

        
    #calculate averages
    stats = {
        party: {
            "mp_count": data["mp_count"],
            "average_attendance_rate": sum(data["attendance"])/len(data["attendance"]) if data["attendance"] else 0,
            "max_attendance_rate": max(data["attendance"]) if data["attendance"] else 0,
            "min_attendance_rate": min(data["attendance"]) if data["attendance"] else 0,
            "average_rebellion_rate": sum(data["rebellion"])/len(data["rebellion"]) if data["rebellion"] else 0,
            "max_rebellion_rate": max(data["rebellion"]) if data["rebellion"] else 0,
            "min_rebellion_rate": min(data["rebellion"]) if data["rebellion"] else 0
        }
        for party, data in party_data.items()
    }

    stats["Sinn Fein"] = {
        "mp_count": 7,
        "average_attendance_rate": 0,
        "max_attendance_rate": 0,
        "min_attendance_rate": 0,
        "average_rebellion_rate": 0,
        "max_rebellion_rate": 0,
        "min_rebellion_rate": 0
    }

    overall_avg_attendance = sum(all_attendance_rates) / len(all_attendance_rates) if all_attendance_rates else 0
    overall_avg_rebellion = sum(all_rebellion_rates) / len(all_rebellion_rates) if all_rebellion_rates else 0

    return {"party_statistics": stats, "overall_average_attendance_rate": overall_avg_attendance, "overall_average_rebellion_rate": overall_avg_rebellion}

def save_to_json(data, output_file):
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)


json_file = r"C:\Users\mtuma\Manifesto-Summarisation-Project\DATA\output.json"
output_file = "party_averages.json"

data = load_json(json_file)
averages = compute_averages(data)
save_to_json(averages, output_file)