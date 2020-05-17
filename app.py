import json
from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
import numpy as np
import math

app = Flask(__name__)

@app.route("/", methods = ['POST', 'GET'])
def index():
    return render_template("test.html", data = {'text': 'Visualization Project'})

@app.route("/pc", methods = ['POST', 'GET'])
def data_load_pc():
    global dataframe
    data_df = dataframe.filter(['index','age','fnlwgt','capital_gain','capital_loss','hours_per_week'], axis=1)
    return {"data_dict" : data_df.values.tolist()}

@app.route("/piechart", methods = ['POST'])
def pie_data():
    global dataframe
    data_df = dataframe.filter(['race','income','index'],axis=1)
    print(dataframe.columns)
    # if request.form['list'] == None:
    filter_df = data_df.groupby(by = ['race','income'])
    filter_df = filter_df.count()
    filter_df.reset_index(inplace=True) 
    return {"data_dict" : filter_df.values.tolist()}


def load_data():
    full_data = pd.read_csv("static/data/sample_adult.csv",header=0) 
    l = full_data.shape[0]
    index = list(range(1,l+1))
    full_data.insert(0, "index", index, True)
    return full_data

if __name__ == '__main__':
    dataframe = load_data()
    app.run(debug=True)