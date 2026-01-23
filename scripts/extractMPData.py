import xml.etree.ElementTree as ET
import json

#parse xml file with mp rebellion/attendance rates
def parse_xml(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    mp_data = {}

    for member in root.findall("memberinfo"):
        mpid = member.get("id").split("/")[-1]

        if member.get("public_whip_data_date") == "complete":
            continue #ignore complete mps

        mp_data[mpid] = {
            "attendance_rate": member.get("public_whip_division_attendance", "N/A"),
            "rebellion_rate": member.get("public_whip_rebellions", "N/A"),
            "attendance_rank": member.get("public_whip_attendrank", "N/A"),
            "attendance_rank_outof": member.get("public_whip_attendrank_outof", "N/A"),
            "rebel_rank": member.get("public_whip_rebelrank", "N/A"),
            "rebel_rank_outof": member.get("public_whip_rebelrank_outof", "N/A")
        }

    return mp_data

#parse txt file with mp list
def parse_txt(txt_file):
    mp_info = {}
    with open(txt_file, "r", encoding="utf-8") as file:
        for line in file:
            #detect the actual data start
            if line.strip() == "mpid\tfirstname\tsurname\tparty\tPublicWhip URL":
                break  #stop skipping when find the column headers

        for line in file:
            parts = line.strip().split("\t")
            if len(parts) >= 5:
                mpid, firstname, surname, party, _ = parts
                mp_info[mpid] = {"name": f"{firstname} {surname}", "party": party}
    
    return mp_info

#merge data into json file
def merge_json(xml_file, txt_file, output_file):
    xml_data = parse_xml(xml_file)
    txt_data = parse_txt(txt_file)

    merged_data = []
    for mpid, stats, in xml_data.items():
        if mpid in txt_data:
            merged_data.append({
                "mpid": mpid,
                "name": txt_data[mpid]["name"],
                "party": txt_data[mpid]["party"],
                **stats
            })
    
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(merged_data, json_file, indent=4)


#run the script with input file paths
xml_file = r"C:\Users\mtuma\Manifesto-Summarisation-Project\DATA\mp-info.xml"  
txt_file = r"C:\Users\mtuma\Manifesto-Summarisation-Project\DATA\votematrix-2024.txt"  
output_file = "output.json"
merge_json(xml_file, txt_file, output_file)