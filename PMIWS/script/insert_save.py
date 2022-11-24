import pandas as pd
import requests
data ='../datacollect/'
df = pd.read_excel(data+"Yiwugo_top_sales_3.xlsx", sheet_name=0)
list1 = list(df['image'])
list2 = list(df['Category'])
list3 = list(df['Product'])
list4 = list(df['Supplier'])
list5 = list(df['Detail'])
list6 = list(df['Price'])
list7 =list(df['Contact'])
# print(list1)

#post img

#downlown img to server
#keep thier id and post in product together



response = requests.get("https://randomuser.me/api/")
print(response.text)