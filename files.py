import sys
import json
import os

def main():
  here = os.path.dirname(os.path.realpath(__file__))
  work = here + "/work"
  list = {}

  for d in os.listdir(work):
    dir = work + "/" + d
    if os.path.isdir(dir):
      list[d] = []
    
      for f in os.listdir(dir):
        #fl = dir + "/" + f
        
        if not 'DS_Store' in f:
          list[d].append(f)

  with open(here + '/files.json', 'w') as fp:
    json.dump(list, fp)

if __name__ == '__main__':
  main()