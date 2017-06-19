import executor_utils as eu
import json
import sys

from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)

@app.route("/")
def hello():
    return "nice"

@app.route('/build_run', methods = ['POST'])
def build_run():
    data = json.loads(request.data)
    if 'code' not in data or 'lang' not in data:
        return 'please provide code and land for data'
    code = data['code']
    lang = data['lang']
    print 'API run code %s in %s' % (code, lang)

    result = eu.build_run(code, lang)
    return jsonify(result)

if __name__ == '__main__':
    eu.load_image()
    port = int(sys.argv[1])
    app.run(port = port)