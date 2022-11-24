import pandas as pd
import requests
import imghdr
import mimetypes
df = pd.read_excel("Yiwugo_top_sales_1.xlsx", sheet_name=0)
df2 = pd.read_excel("Yiwugo_top_sales_2.xlsx", sheet_name=0)
df3 = pd.read_excel("Yiwugo_top_sales_3.xlsx", sheet_name=0)
df4 = pd.read_excel("Yiwugo_top_sales_4.xlsx", sheet_name=0)
df5 = pd.read_excel("Yiwugo_top_sales_5.xlsx", sheet_name=0)
df6 = pd.read_excel("Yiwugo_top_sales_6.xlsx", sheet_name=0)
df7 = pd.read_excel("Yiwugo_top_sales_7.xlsx", sheet_name=0)
df8 = pd.read_excel("Yiwugo_top_sales_8.xlsx", sheet_name=0)
df9 = pd.read_excel("Yiwugo_top_sales_9.xlsx", sheet_name=0)
df10 = pd.read_excel("Yiwugo_top_sales_10.xlsx", sheet_name=0)
# insert the name of the column as a string in brackets
superlist = []
list1 = list(df['image'])
list2 = list(df2['image'])
list3 = list(df3['image'])
list4 = list(df4['image'])
list5 = list(df5['image'])
list6 = list(df6['image'])
list7 = list(df7['image'])
list8 = list(df8['image'])
list9 = list(df9['image'])
list10 = list(df10['image'])
# superlist.extend(list7)
# superlist.extend(list8)
# superlist.extend(list9)
superlist.extend(list1)
superlist.extend(list2)
superlist.extend(list3)

# print(list1)


def saveimage(image):
    print(image)
    y = image.split("?")
    z = y[0].split('/')
    print(z[8])
    save_path = '../dataset/'
    img_data = requests.get(image).content
    with open(save_path+z[8], 'wb') as handler:
        handler.write(img_data)


def is_url_image(image_url):
    image_formats = ("image/png", "image/jpeg", "image/jpg",
                     "image/PNG", "image/JPG", "image/JPEG")
    r = requests.head(image_url)
    if r.headers["content-type"] in image_formats:
        return True
    return False


def listsave(list2):
    for idx, x in enumerate(list2):
        if(is_url_image(x)):
            saveimage(x)

        else:

            print(x, "be not image")


listsave(superlist)
# print(superlist)
