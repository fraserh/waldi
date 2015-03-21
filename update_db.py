from matcher import match_all
from subprocess import call

if __name__ == '__main__':
  match_all.match_all()
  call(["python import_matches", "results.txt"])