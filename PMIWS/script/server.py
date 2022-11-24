import os
from flask import Flask, flash, request, redirect, url_for,jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import flask
from json import dumps
import numpy as np
from pathlib import Path
from FeatureExtractor import FeatureExtractor
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import firestore
from flask_cors import CORS

cred = credentials.Certificate('./key/pimws-9c5be-firebase-adminsdk-5icsm-67e79414b5.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
fe = FeatureExtractor()

DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)

CORS(app, resources={r'/*': {'origins': '*'}})

features = []
img_paths = []
for feature_path in Path("./feature").glob("*.npy"):
    features.append(np.load(feature_path))
    img_paths.append(feature_path.stem)
features = np.array(features)


def getList(dict):
      
    return [*dict]

@app.route('/')
def home():
 
    return "Hello My First Flask Project"


@app.route('/searchimage', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        file = request.files['query_img']


        # Save query image
        img = Image.open(file.stream)  # PIL image
        uploaded_img_path = "./uploaded/"  + file.filename
        img.save(uploaded_img_path)

        query = fe.extract(img)
        dists = np.linalg.norm(features-query, axis=1)  # L2 distances to features
        ids = np.argsort(dists)[:40]  # Top 30 results
        image_id = []
        for id in ids:
            if id < len(img_paths):
                image_id.append(img_paths[id])
        print(image_id)
        ProductRef = db.collection(u'Product')
        listdata =[]
        listimages=[]
        for list in image_id:
            print(list)
            if ('S'+list) not in listimages:
                img = ProductRef.where(u"image."+'S'+list,u"!=" ,u"").get()
                for i in img:

                    first_image = next(iter(i.to_dict()['image'].items()))[1]
                    listA= i.to_dict()
                    listA['firstimage'] = first_image
                    listA['id'] = img[0].id
                    listdata.append(listA)
                    
                    listimages.extend(getList(i.to_dict()['image']))
                    # print(listimages)

        print(len(listdata))
     
    return dumps(listdata)


@app.route('/searchproduct', methods=['GET', 'POST'])
def products():
    listproduct=[]

    if request.method == 'POST':
        productJson = request.get_json(force=True)
        productid = productJson['id']
        if(productid):
            ProductRef = db.collection(u'Product')     
         
            product = ProductRef.document(u''+productid).get()
            
            
            
            listproduct.append(product.to_dict())
            # print(productid,product.to_dict()) 
            # print(setid,listproduct)
    return dumps(listproduct)

if __name__ == '__main__':
    app.run(debug=True)
