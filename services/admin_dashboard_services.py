from typing import Tuple, Dict, Any
from models.major_model import get_all_majors
from models.user_model import get_user_stats


def get_all_majors_service() -> Tuple[Dict[str, Any], int]:
    """
    Returns all majors data and total count for admin dashboard.
    """
    majors = get_all_majors()
    return {
        'majors': majors,
        'total_count': len(majors)
    }, 200


def get_admin_dashboard_stats() -> Tuple[Dict[str, Any], int]:
    """
    Returns admin dashboard stats while preserving the existing frontend contract.
    """
    stats = get_user_stats()
    return {
        "total_users": stats["totalUsers"],
        "active_users": stats["activeUsers"],
        "inactive_users": stats["inactiveUsers"],
        "stats": {
            "total_users": stats["totalUsers"],
            "active_users": stats["activeUsers"],
            "inactive_users": stats["inactiveUsers"],
        },
    }, 200


def get_admin_user_stats_service() -> Tuple[Dict[str, Any], int]:
    """
    Returns user statistics for admin APIs in a frontend-friendly JSON shape.
    """
    return get_user_stats(), 200

