import sys
import json
import os
from PIL import Image

def main():
  here = os.path.dirname(os.path.realpath(__file__))
  work = here + "/work"
  list = {}
  size = 740, 740

  for d in os.listdir(work):
    dir = work + "/" + d
    if os.path.isdir(dir):
      list[d] = []
    
      for f in os.listdir(dir):
        fl = dir + "/" + f
        
        if not 'DS_Store' in f:
          list[d].append(f)
        
          try:
              im = Image.open(fl)
              im.thumbnail(size, Image.ANTIALIAS)
              im.save(fl, "JPEG")
          except IOError:
              print("cannot create thumbnail for '%s'" % fl)

  with open(here + '/files.json', 'w') as fp:
    json.dump(list, fp)

if __name__ == '__main__':
  main()