"""
Parser Constants
"""
import parse_utils

INVALID_ENTRY = "NA"

COLES_CONTAINER_DIV = {"tag":"div","class":"wrapper"}

COLES_PARAMS = [
  {
    "elements_to_search":
      {
        "tag":["div","a"],
        "class": ["detail", "product-url"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func": parse_utils.ignore_words,
        "params": [parse_utils.COLES_IGNORE_LIST]
      }
    ],
  },
  {
    "elements_to_search":
      {
        "tag": ["div"],
        "class": ["unit-price"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.splitSplice,
        "params":["</span>",1]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func":parse_utils.regexBetweenTwoStrings,
        "params":["$","per"]
      }
    ],
    "backup_elements":
    {
      "tag": ["div"],
      "class": ["offer-price"]
    }
  },
    {
    "elements_to_search":
      {
        "tag": ["div"],
        "class": ["unit-price"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.each_or_kilo,
        "params":["perEa"]
      }
    ],
    "backup_elements":
    {
      "tag": [],
      "class": []
    }
  },
  {
    "elements_to_search":
      {
        "tag":["div","a"],
        "class": ["detail", "product-url"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func": parse_utils.get_unit_coles,
        "params": []
      }
    ],
  },
  {
    "elements_to_search":
      {
        "tag":["div"],
        "class": ["price"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func": parse_utils.splitSplice,
        "params": ["</small>",1]
      }
    ],
    "backup_elements":
    {
      "tag": ["div"],
      "class": ["offer-detail"]
    },
    "backup_processing": {
      "extract_data" :[
      {
        "func": parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func": parse_utils.coles_special_prices,
        "params":[]
      },
    ],}
  },
]

"""
Woolworths constants start.
"""

WOOLIES_CONTAINER_DIV = {"tag":"div","class":"product-stamp-grid"}

WOOLIES_PARAMS = [
  {
    "elements_to_search":
      {
        "tag":["span"],
        "class": ["description"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.splitSplice,
        "params":["<span",0]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func": parse_utils.ignore_words,
        "params": [""]
      }
    ],
  },
  {
    "elements_to_search":
      {
        "tag": ["div"],
        "class": ["cup-price"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func":parse_utils.regexBetweenTwoStrings,
        "params":["$"," / "]
      }
    ],
    "backup_elements":
    {
      "tag": ["div"],
      "class": ["offer-price"]
    }
  },
  {
    "elements_to_search":
      {
        "tag": ["span"],
        "class": ["price"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func":parse_utils.regexBetweenTwoStrings,
        "params":["$",""]
      }
    ],
    "backup_elements":
    {
      "tag": ["div"],
      "class": ["offer-price"]
    }
  },
  {
    "elements_to_search":
      {
        "tag": ["span"],
        "class": ["volume-size"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func":parse_utils.get_unit_size_woolies,
        "params": []
      }
    ],
    "backup_elements":
    {
      "tag": ["div"],
      "class": ["offer-price"]
    }
  },
    {
    "elements_to_search":
      {
        "tag": ["div"],
        "class": ["cup-price"]
      },
    "extract_data": [
      {
        "func":parse_utils.getInnerHTML,
        "params":[]
      },
      {
        "func":parse_utils.prettifyString,
        "params":[]
      },
      {
        "func":parse_utils.get_unit_woolies,
        "params":["/ ",""]
      }
    ],
    "backup_elements":
    {
      "tag": ["div"],
      "class": ["offer-price"]
    }
  },
]