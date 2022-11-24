import pandas as pd
import requests
import imghdr
import mimetypes
import re
import requests
import asyncio
import time
import aiohttp
import json
from tabulate import tabulate
df = pd.read_excel(
    "../../datacollect/Yiwugo_top_sales_1 (clean).xlsx", sheet_name=0)
list1 = list(df['image'])
list2 = list(df['Product'])
list3 = list(df['Contect(clean)'])
# list4 = list(df['Supplier'])
list5 = list(df['Price(clean)'])
# list6 = list(df['Price'])
# list7 =list(df['Contact'])
# print(list)


def getContact(value):
    A = value.split(",")
    B = {}
    contact = {}
    for slice in A:

        # print(len(slice.split(":")))
        # print(slice.split(":")[0])

        B[slice.replace(" ", "").split(":")[0]] = slice.replace(
            " ", "").split(":")[1]

        contact = B

    return contact


def getPrice(value):
    A = value.replace("￥", "¥").replace(" ", "")
   
    B = A.split("¥")

    C = A[0]

    price = {"yuan": B[1]}

    return price

class obj:
      
    # constructor
    def __init__(self, dict1):
        self.__dict__.update(dict1)
   
def dict2obj(dict1):
      
    # using json.loads method and passing json.dumps
    # method and custom object hook as arguments
    return json.loads(json.dumps(dict1), object_hook=obj)


async def main():
    
    async with aiohttp.ClientSession() as session:
        setImages = []
        for index in range(len(list1)):
            # print(type(list3[index]))
            setImages.append(list1[index])

            if type(list3[index]) is not float:
                Contact = getContact(list3[index])
                Name = Contact['Contacts']
                Detail = list2[index]
                # print(Contact)
                Images = setImages
                setImages = []
                Price = getPrice(list5[index])

                # print(list1[index])
                Product = {
                    "detail": Detail,
                    "category": "buddha",
                    "image": Images,
                    "supplier": {"name": Name, "contact": Contact},
                    "price": Price,
                }

                # print(json.dumps(Product, indent = 4),len(Product))

                async with session.post('http://localhost:8090/api/product/addproduct', data=json.dumps(Product, indent = 4) , headers={'Content-type': 'application/json', 'Accept': 'text/plain'}) as resp:
                    print(resp.status)
                    print(await resp.text())
                time.sleep(1)
          




start_time = time.time()

asyncio.run(main())
print("--- %s seconds ---" % (time.time() - start_time))