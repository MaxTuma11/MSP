import xml.etree.ElementTree as ET
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

XML_FILE = BASE_DIR / "src/data/publicwhip/mp-info.xml"
TXT_FILE = BASE_DIR / "src/data/publicwhip/votematrix-2024.txt"
OUTPUT_FILE = BASE_DIR / "src/data/publicwhip/mp_stats.json"


def parse_xml(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    mp_data = {}

    for member in root.findall("memberinfo"):
        mpid = member.get("id", "").split("/")[-1]
        if not mpid:
            continue

        #some entries are marked complete but still valid — skip only if no stats exist
        if not member.get("public_whip_division_attendance"):
            continue

        mp_data[mpid] = {
            "attendance_rate": member.get("public_whip_division_attendance", "N/A"),
            "rebellion_rate": member.get("public_whip_rebellions", "N/A"),
            "attendance_rank": member.get("public_whip_attendrank", "N/A"),
            "attendance_rank_outof": member.get("public_whip_attendrank_outof", "N/A"),
            "rebel_rank": member.get("public_whip_rebelrank", "N/A"),
            "rebel_rank_outof": member.get("public_whip_rebelrank_outof", "N/A"),
        }

    return mp_data


def parse_txt(txt_file):
    mp_info = {}
    with open(txt_file, "r", encoding="utf-8") as file:
        for line in file:
            if line.strip().startswith("mpid"):
                break

        for line in file:
            parts = line.strip().split("\t")
            if len(parts) >= 5:
                mpid, firstname, surname, party, *_ = parts
                mp_info[mpid] = {
                    "name": f"{firstname} {surname}",
                    "party": party,
                }

    return mp_info


def merge_json(xml_data, txt_data):
    merged = []

    for mpid, stats in xml_data.items():
        if mpid in txt_data:
            merged.append({
                "mpid": mpid,
                "name": txt_data[mpid]["name"],
                "party": txt_data[mpid]["party"],
                **stats,
            })

    return merged


def main():
    xml_data = parse_xml(XML_FILE)
    txt_data = parse_txt(TXT_FILE)
    merged_data = merge_json(xml_data, txt_data)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(merged_data, f, indent=2)

    print(f"Public Whip MP stats written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
