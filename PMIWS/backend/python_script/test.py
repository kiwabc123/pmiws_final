import sys


def hi(text):
    print("aaaaa")


def hello(text):
    print("Hello " + text + "!")


def welcome(text):
    print("Welcome, " + text + "!")


if sys.argv[1] == 'hi':
    hi(sys.argv[2])
elif sys.argv[2] == 'hello':
    hello(sys.argv[2])
elif sys.argv[1] == 'welcome':
    welcome(sys.argv[2])
else:
    hi(sys.argv[2])

sys.stdout.flush()
