import pandas as pd
import requests
import imghdr
import mimetypes
import re
from firebase import firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

df = pd.read_excel("Yiwugo_top_sales_3.xlsx", sheet_name=0)
list1 = list(df['image'])
list2 = list(df['Category'])
list3 = list(df['Product'])
list4 = list(df['Supplier'])
list5 = list(df['Detail'])
list6 = list(df['Price'])
list7 =list(df['Contact'])
cred = credentials.Certificate('./key/pimws-9c5be-firebase-adminsdk-5icsm-67e79414b5.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
def firebase_insert(img,category,name,supplier):
    
      doc_ref = db.collection('Product').document()
      data =  { 'Name': name,
          'Category': category,
          'Supplier':supplier,
          'image':img
      }
      doc_ref.set(data)

def saveimage(image):
      # print(image)
      y = image.split("?")
      z = y[0].split('/')
      final =z[8].split(".")
      return('S'+final[0])

img ={}
for idx,list in enumerate(list7):
     
      # img.append(saveimage(list1[idx]))
      img[saveimage(list1[idx])] = list1[idx]
      # print(idx,img)
      if type(list)is not float:
            category =list2[idx]
            name = list3[idx]
            supplier =list4[idx]

            # print(idx,img)
            firebase_insert(img,category,name,supplier)
            img.clear()
      

