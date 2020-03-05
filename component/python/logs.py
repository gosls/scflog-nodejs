# -*- coding: utf8 -*-

import os
import sys
import json
import urllib.parse
import urllib.request


def print(*args):
    url = os.environ.get("real_time_log_url")
    cid = os.environ.get("real_time_log_id")
    if url and cid and os.environ.get("real_time_log_id", None):
        try:
            retmsg = {
                "coid": cid,
                "data": " ".join([str(eveObject) for eveObject in args])
            }
            urllib.request.urlopen(
                urllib.request.Request(
                    url=url,
                    data=json.dumps(retmsg).encode("utf-8")
                )
            )
        except Exception as e:
            sys.stdout.write("Debug Error:" + str(e))
    sys.stdout.write("aaa"+  " ".join([str(eveObject) for eveObject in args]) + "\n")
