from __future__ import annotations


def slugify_major_name(name: str) -> str:
    return name.strip().lower().replace(" ", "-")


MAJOR_CATALOG = {
    "manajemen": {
        "name": "Manajemen",
        "field": "Soshum",
        "min_score": 75.0,
        "ukt_min": 3000000,
        "ukt_max": 7000000,
    },
    "psikologi": {
        "name": "Psikologi",
        "field": "Soshum",
        "min_score": 78.0,
        "ukt_min": 3500000,
        "ukt_max": 8000000,
    },
    "keperawatan": {
        "name": "Keperawatan",
        "field": "Saintek",
        "min_score": 79.0,
        "ukt_min": 4000000,
        "ukt_max": 9000000,
    },
    "akuntansi": {
        "name": "Akuntansi",
        "field": "Soshum",
        "min_score": 76.0,
        "ukt_min": 3000000,
        "ukt_max": 7500000,
    },
    "pendidikan-guru-sd": {
        "name": "Pendidikan Guru SD",
        "field": "Soshum",
        "min_score": 73.0,
        "ukt_min": 2500000,
        "ukt_max": 6000000,
    },
    "ilmu-komunikasi": {
        "name": "Ilmu Komunikasi",
        "field": "Soshum",
        "min_score": 74.0,
        "ukt_min": 3000000,
        "ukt_max": 7000000,
    },
    "bisnis-digital": {
        "name": "Bisnis Digital",
        "field": "Soshum",
        "min_score": 77.0,
        "ukt_min": 3500000,
        "ukt_max": 8000000,
    },
    "ilmu-hukum": {
        "name": "Ilmu Hukum",
        "field": "Soshum",
        "min_score": 77.0,
        "ukt_min": 3500000,
        "ukt_max": 8000000,
    },
    "gizi": {
        "name": "Gizi",
        "field": "Saintek",
        "min_score": 78.0,
        "ukt_min": 4000000,
        "ukt_max": 8500000,
    },
    "fisioterapi": {
        "name": "Fisioterapi",
        "field": "Saintek",
        "min_score": 80.0,
        "ukt_min": 4500000,
        "ukt_max": 9500000,
    },
    "ilmu-administrasi-negara": {
        "name": "Ilmu Administrasi Negara",
        "field": "Soshum",
        "min_score": 74.0,
        "ukt_min": 2800000,
        "ukt_max": 6500000,
    },
    "pendidikan-bahasa-dan-sastra-indonesia": {
        "name": "Pendidikan Bahasa dan Sastra Indonesia",
        "field": "Soshum",
        "min_score": 72.0,
        "ukt_min": 2500000,
        "ukt_max": 6000000,
    },
    "ekonomi": {
        "name": "Ekonomi",
        "field": "Soshum",
        "min_score": 75.0,
        "ukt_min": 3000000,
        "ukt_max": 7000000,
    },
    "teknik-informatika": {
        "name": "Teknik Informatika",
        "field": "Saintek",
        "min_score": 82.0,
        "ukt_min": 3500000,
        "ukt_max": 8500000,
    },
    "sosiologi": {
        "name": "Sosiologi",
        "field": "Soshum",
        "min_score": 73.0,
        "ukt_min": 2800000,
        "ukt_max": 6500000,
    },
    "sistem-informasi": {
        "name": "Sistem Informasi",
        "field": "Saintek",
        "min_score": 79.0,
        "ukt_min": 3200000,
        "ukt_max": 7800000,
    },
    "teknologi-pangan-dan-hasil-pertanian": {
        "name": "Teknologi Pangan dan Hasil Pertanian",
        "field": "Saintek",
        "min_score": 77.0,
        "ukt_min": 3500000,
        "ukt_max": 8000000,
    },
    "teknik-sipil": {
        "name": "Teknik Sipil",
        "field": "Saintek",
        "min_score": 80.0,
        "ukt_min": 3800000,
        "ukt_max": 8500000,
    },
    "bimbingan-dan-konseling": {
        "name": "Bimbingan dan Konseling",
        "field": "Soshum",
        "min_score": 72.0,
        "ukt_min": 2500000,
        "ukt_max": 6000000,
    },
    "kedokteran": {
        "name": "Kedokteran",
        "field": "Saintek",
        "min_score": 90.0,
        "ukt_min": 15000000,
        "ukt_max": 30000000,
    },
}


DEFAULT_MAJORS = [
    {
        "slug": slug,
        "name": major["name"],
        "field": major["field"],
        "min_score": major["min_score"],
        "ukt_min": major["ukt_min"],
        "ukt_max": major["ukt_max"],
        "ukt": major["ukt_max"],
    }
    for slug, major in MAJOR_CATALOG.items()
]
