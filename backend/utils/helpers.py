import datetime
import random
import string

def generate_report_id() -> str:
    """
    Generate unique Report ID in standard format: VG-YYYYMMDD-XXXXX
    e.g. VG-20260904-48291
    """
    today_str = datetime.datetime.utcnow().strftime("%Y%m%d")
    random_digits = "".join(random.choices(string.digits, k=5))
    return f"VG-{today_str}-{random_digits}"

def generate_call_id() -> str:
    """
    Generate unique Call ID: CALL-XXXXXX
    """
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"CALL-{chars}"

def format_timestamp(dt: datetime.datetime = None) -> str:
    if not dt:
        dt = datetime.datetime.utcnow()
    return dt.strftime("%b %d, %Y %I:%M %p")
