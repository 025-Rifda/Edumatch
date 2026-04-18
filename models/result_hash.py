import hashlib
import json


def build_result_hash(result_payload_or_json: dict | str) -> str:
    if isinstance(result_payload_or_json, str):
        try:
            normalized_payload = json.loads(result_payload_or_json)
        except json.JSONDecodeError:
            normalized_payload = result_payload_or_json
    else:
        normalized_payload = result_payload_or_json

    canonical_json = json.dumps(
        normalized_payload,
        ensure_ascii=True,
        sort_keys=True,
        separators=(",", ":"),
    )
    return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()
