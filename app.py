import json
from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
import numpy as np
import math
from sklearn.decomposition import PCA
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

app = Flask(__name__)

def transform_data(df):
    categorical = ["workclass","marital_status","occupation","relationship","race","sex","native_country"]
    ordinal = ["education"]
    education_ordering = ["","Preschool","1st-4th","5th-6th","7th-8th","9th","10th","11th","12th","HS-grad","Prof-school","Assoc-acdm","Assoc-voc","Some-college","Bachelors","Masters","Doctorate"]
    numerical = ["age","fnlwgt","education_num","capital_gain","capital_loss","hours_per_week"]
    ohe = OneHotEncoder(sparse=False, drop='first')
    categorical_df = ohe.fit_transform(df[categorical])
    categorical_df = pd.DataFrame(categorical_df, columns = ohe.get_feature_names())
    oe = OrdinalEncoder(categories = [education_ordering])
    ordinal_df = oe.fit_transform(df[ordinal])
    ordinal_df = pd.DataFrame(ordinal_df, columns = ordinal)
    ordinal_df = pd.DataFrame(StandardScaler().fit_transform(ordinal_df), columns = ordinal_df.columns)
    ss = StandardScaler()
    numerical_df = pd.DataFrame(ss.fit_transform(df[numerical]), columns = df[numerical].columns)  
    final_df = pd.concat([numerical_df, categorical_df, ordinal_df], axis=1)    
    return final_df

@app.route("/", methods = ['POST', 'GET'])
def index():
    return render_template("index.html", data = {'text': 'Visualization Project'})

@app.route("/getpca", methods = ['POST'])
def get_pca_two_plot():
    global pca_data
    # i = request.form['list']
    pca = PCA(n_components = 2).fit_transform(pca_data)
    print(pca)
    return {'data_dict': pca.tolist()}

@app.route("/pc", methods = ['POST'])
def data_load_pc():
    global dataframe
    data_df = dataframe.filter(['idx','age','fnlwgt','capital_gain','capital_loss','hours_per_week','income'], axis=1)
    return {"data_dict" : data_df.values.tolist()}

@app.route("/piechart", methods = ['POST'])
def pie_data():
    global dataframe
    data_df = dataframe.filter(['race','income','idx'],axis=1)
    if 'list' not in request.form:
        filter_df = data_df.groupby(by = ['race','income'])
        filter_df = filter_df.count()
        filter_df.reset_index(inplace=True)
        pivot_df = filter_df.pivot(index= 'race', columns = 'income' , values = 'idx')
        pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
        pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
        pivot_df.reset_index(inplace=True)
        return {"data_dict" : pivot_df.values.tolist()}
    else:
        s = request.form['list'] 
        i = request.form['income_filter']
        filter_df = data_df.loc[eval(s)]
        new_filter_df = filter_df.groupby(by = ['race','income'])
        new_filter_df = new_filter_df.count()
        new_filter_df.reset_index(inplace=True)
        pivot_df = new_filter_df.pivot(index= 'race', columns = 'income' , values = 'idx')
        z_list = [0] * (pivot_df.shape[0])
        if (i == '>50K'):
            pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
            pivot_df['<=50K'] = z_list
        elif (i == '<=50K'):
            pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
            pivot_df['>50K'] = z_list
        else: 
            pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
            pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
        pivot_df.reset_index(inplace=True)
        pivot_df = pivot_df[['race','<=50K','>50K']]
        return {"data_dict" : pivot_df.values.tolist()}


@app.route("/hori_bc", methods = ['POST'])
def horizontal_bar_data():
    global dataframe
    data_df = dataframe.filter(['occupation','income','idx'],axis=1)
    if 'list' not in request.form:
        filter_df = data_df.groupby(by = ['occupation','income']).count()
        filter_df.reset_index(inplace=True)
        pivot_df = filter_df.pivot(index= 'occupation', columns = 'income' , values = 'idx')
        pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
        pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
        pivot_df.reset_index(inplace=True)
        s_df = pivot_df.values.tolist()
        s_df.sort(key = lambda x: -x[1] - x[2])
        return {"data_dict" : s_df}
    else:
        s = request.form['list'] 
        i = request.form['income_filter']
        filter_df = data_df.loc[eval(s)]
        new_filter_df = filter_df.groupby(by = ['occupation','income'])
        new_filter_df = new_filter_df.count()
        new_filter_df.reset_index(inplace=True)
        pivot_df = new_filter_df.pivot(index= 'occupation', columns = 'income' , values = 'idx')
        z_list = [0] * (pivot_df.shape[0])
        if (i == '>50K'):
            pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
            pivot_df['<=50K'] = z_list
        elif (i == '<=50K'):
            pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
            pivot_df['>50K'] = z_list
        else: 
            pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
            pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
        pivot_df.reset_index(inplace=True)
        pivot_df = pivot_df[['occupation','<=50K','>50K']]
        s_df = pivot_df.values.tolist()
        s_df.sort(key = lambda x: -x[1] - x[2])
        return {"data_dict" : s_df}

@app.route("/barch", methods = ['POST'])
def bar_data():
    global dataframe
    data_df = dataframe.filter(['marital_status','income','idx'],axis=1)
    if 'list' not in request.form:
        filter_df = data_df.groupby(by = ['marital_status','income'])
        filter_df = filter_df.count()
        filter_df.reset_index(inplace=True) 
        pivot_df = filter_df.pivot(index= 'marital_status', columns = 'income' , values = 'idx')
        pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
        pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
        pivot_df.reset_index(inplace=True)
        return_val = pivot_df.values.tolist()
        return {"data_dict" : return_val}
    else:
        s = request.form['list'] 
        i = request.form['income_filter']
        filter_df = data_df.loc[eval(s)]
        new_filter_df = filter_df.groupby(by = ['marital_status','income'])
        new_filter_df = new_filter_df.count()
        new_filter_df.reset_index(inplace=True)
        pivot_df = new_filter_df.pivot(index= 'marital_status', columns = 'income' , values = 'idx')
        z_list = [0] * (pivot_df.shape[0])
        if (i == '>50K'):
            pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
            pivot_df['<=50K'] = z_list
        elif (i == '<=50K'):
            pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
            pivot_df['>50K'] = z_list
        else: 
            pivot_df.loc[pivot_df['>50K'].isnull() , '>50K'] = 0
            pivot_df.loc[pivot_df['<=50K'].isnull() , '<=50K'] = 0
        pivot_df.reset_index(inplace=True)
        pivot_df = pivot_df[['marital_status','<=50K','>50K']]
        return {"data_dict" : pivot_df.values.tolist()}

def load_data():
    full_data = pd.read_csv("static/data/sample_adult2.csv",header=0)
    l = full_data.shape[0]
    idx = list(range(1,l+1))
    t_data = transform_data(full_data)
    full_data.insert(0, "idx", idx, True)
    t_data.insert(0, "idx", idx, True)
    return full_data,t_data

if __name__ == '__main__':
    dataframe, pca_data= load_data()
    app.run(debug=True)