"""
Parser Constants
"""
import parsecontrollers

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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.splitSplice,
        "params":["</span>",1]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
      {
        "func":parsecontrollers.regexBetweenTwoStrings,
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.each_or_kilo,
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
      {
        "func": parsecontrollers.get_unit_coles,
        "params": []
      }
    ],
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.splitSplice,
        "params":["<span",0]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
      {
        "func":parsecontrollers.regexBetweenTwoStrings,
        "params":["$"," / 1"]
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
      {
        "func":parsecontrollers.regexBetweenTwoStrings,
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
      {
        "func":parsecontrollers.ignore_words,
        "params":["punnet", "cup", "bunch", "bag", "large tray", "per", "min."]
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
        "func":parsecontrollers.getInnerHTML,
        "params":[]
      },
      {
        "func":parsecontrollers.prettifyString,
        "params":[]
      },
      {
        "func":parsecontrollers.get_unit_woolies,
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